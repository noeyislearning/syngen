import type { Response } from "express"
import { Socket, Server } from "socket.io"

import ChatMessage from "../../models/message.model"

import type { MessagePayload, SendMessageRequest, IMessage } from "../../lib/types"

export const handleMessage = async (socket: Socket, io: Server, payload: MessagePayload) => {
  console.log("Server handleMessage function called:", payload)
  try {
    const { senderId, receiverId, text } = payload

    const chatMessage = new ChatMessage({
      senderId,
      receiverId,
      text,
    })
    await chatMessage.save()

    const socketIdMap = io.of("/").sockets

    const receiverSocket = Array.from(socketIdMap.values()).find(
      (s: Socket) => s.handshake.query.userId === receiverId,
    )
    const senderSocket = Array.from(socketIdMap.values()).find(
      (s: Socket) => s.handshake.query.userId === senderId,
    )

    if (receiverSocket) {
      console.log("Server Emitting to receiver (socketId):", receiverSocket.id, "payload:", {
        senderId,
        receiverId,
        text,
        timestamp: chatMessage.timestamp.toISOString(),
      })
      receiverSocket.emit("chatMessage", {
        senderId,
        receiverId,
        text,
        timestamp: chatMessage.timestamp.toISOString(),
      })
    } else {
      console.log(`Receiver socket for userId ${receiverId} not found.`)
    }

    if (senderSocket) {
      console.log("Server Emitting to sender (socketId):", senderSocket.id, "payload:", {
        senderId,
        receiverId,
        text,
        timestamp: chatMessage.timestamp.toISOString(),
      })
      senderSocket.emit("chatMessage", {
        senderId,
        receiverId,
        text,
        timestamp: chatMessage.timestamp.toISOString(),
      })
    } else {
      console.log(`Sender socket for userId ${senderId} not found.`)
    }

    console.log("Chat message saved and broadcasted:", chatMessage)
  } catch (error) {
    console.error("Error handling chat message:", error)
    socket.emit("chatMessageError", {
      message: "Failed to send message",
      error: (error as Error).message,
    })
  }
}

export const sendMessageController = async (
  req: SendMessageRequest,
  res: Response,
): Promise<void> => {
  try {
    const { senderId, receiverId, messageType, text, subject, senderNumber, receiverNumber } =
      req.body // ADDED senderNumber, receiverNumber

    if (!senderId || !receiverId || !messageType || !text) {
      res.status(400).json({ message: "Missing required fields." })
      return
    }

    if (messageType === "email" && !subject) {
      res.status(400).json({ message: "Subject is required for email messages." })
      return
    }

    if (messageType === "sms" && (!senderNumber || !receiverNumber)) {
      // CHECK if senderNumber and receiverNumber is missing
      res
        .status(400)
        .json({ message: "Sender and receiver numbers are required for SMS messages." })
      return
    }

    const newMessage: IMessage = new ChatMessage({
      senderId,
      receiverId,
      messageType,
      text,
      subject: messageType === "email" ? subject : null,
      senderNumber: messageType === "sms" ? senderNumber : null, // ADD senderNumber conditionally
      receiverNumber: messageType === "sms" ? receiverNumber : null, // ADD receiverNumber conditionally
    })

    await newMessage.save()

    res.status(201).json({ message: "Message sent and saved.", messageId: newMessage._id })
  } catch (error) {
    console.error("Error in sendMessageController:", error)
    res.status(500).json({ message: "Failed to send message.", error: (error as Error).message })
  }
}
