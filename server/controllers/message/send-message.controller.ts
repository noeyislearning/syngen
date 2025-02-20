import type { Response } from "express"
import { Socket, Server } from "socket.io"

import ChatMessage from "../../models/message.model"

import type { MessagePayload, SendMessageRequest, IMessage } from "../../lib/types"

export const handleMessage = async (
  socket: Socket,
  io: Server,
  payload: MessagePayload,
  messageType: string = "chat",
) => {
  console.log(`Server handleMessage function called for ${messageType}:`, payload)
  try {
    const { senderId, receiverId, text } = payload

    const chatMessage = new ChatMessage({
      senderId,
      receiverId,
      text,
      messageType: messageType,
    })
    await chatMessage.save()

    const socketIdMap = io.of("/").sockets

    const receiverSocket = Array.from(socketIdMap.values()).find(
      (s: Socket) => s.handshake.query.userId === receiverId,
    )
    const senderSocket = Array.from(socketIdMap.values()).find(
      (s: Socket) => s.handshake.query.userId === senderId,
    )

    const emitPayload = {
      senderId,
      receiverId,
      text,
      timestamp: chatMessage.timestamp.toISOString(),
      messageType: messageType,
    }

    if (receiverSocket) {
      console.log(
        `Server Emitting to receiver (socketId): ${receiverSocket.id} for ${messageType} payload:`,
        emitPayload,
      )
      receiverSocket.emit("message", emitPayload)
    } else {
      console.log(`Receiver socket for userId ${receiverId} not found for ${messageType}.`)
    }

    if (senderSocket) {
      console.log(
        `Server Emitting to sender (socketId): ${senderSocket.id} for ${messageType} payload:`,
        emitPayload,
      )
      senderSocket.emit("message", emitPayload)
    } else {
      console.log(`Sender socket for userId ${senderId} not found for ${messageType}.`)
    }

    console.log(`Chat message saved and broadcasted for ${messageType}:`, chatMessage)
  } catch (error) {
    console.error(`Error handling ${messageType} message:`, error)
    socket.emit("chatMessageError", {
      message: `Failed to send ${messageType} message`,
      error: (error as Error).message,
    })
  }
}

export const sendMessageController = async (
  req: SendMessageRequest,
  res: Response,
): Promise<void> => {
  try {
    const { senderId, receiverId, messageType, text, subject } = req.body

    if (!senderId || !receiverId || !messageType || !text) {
      res.status(400).json({ message: "Missing required fields." })
      return
    }

    if (messageType === "email" && !subject) {
      res.status(400).json({ message: "Subject is required for email messages." })
      return
    }

    const newMessage: IMessage = new ChatMessage({
      senderId,
      receiverId,
      messageType,
      text,
      subject: messageType === "email" ? subject : undefined,
    })

    await newMessage.save()

    if (messageType === "chat" || messageType === "sms") {
      await handleMessage(
        {} as Socket,
        req.app.get("io"),
        { senderId, receiverId, text },
        messageType,
      )
    }

    res.status(201).json({ message: "Message sent and saved.", messageId: newMessage._id })
  } catch (error) {
    console.error("Error in sendMessageController:", error)
    res.status(500).json({ message: "Failed to send message.", error: (error as Error).message })
  }
}
