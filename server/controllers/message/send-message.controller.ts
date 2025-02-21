import type { Response } from "express"
import { Socket, Server } from "socket.io"

import ChatMessage from "../../models/message.model"

import type { MessagePayload, SendMessageRequest, IMessage, IAttachment } from "../../lib/types"

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
      messageId: chatMessage._id.toString(),
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

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
    const attachmentFiles = files?.attachments || []

    if (!senderId || !receiverId || !messageType || !text) {
      res.status(400).json({ message: "Missing required fields." })
      return
    }

    if (messageType === "email" && !subject) {
      res.status(400).json({ message: "Subject is required for email messages." })
      return
    }

    const attachments: IAttachment[] = []

    if (attachmentFiles && attachmentFiles.length > 0) {
      for (const file of attachmentFiles) {
        const fileUrl = `/uploads/${file.filename}`

        const attachment: IAttachment = {
          filename: file.originalname,
          fileUrl: fileUrl,
          fileType: file.mimetype,
        }
        attachments.push(attachment)
      }
    }

    const newMessage: IMessage = new ChatMessage({
      senderId,
      receiverId,
      messageType,
      text,
      subject: messageType === "email" ? subject : undefined,
      attachments: attachments,
    })

    await newMessage.save()

    if (messageType === "chat" || messageType === "sms") {
      await handleMessage(
        {} as Socket,
        req.app.get("io"),
        { senderId, receiverId, text },
        messageType,
      )
    } else if (messageType === "email") {
      console.log("Email message saved. Emitting 'emailSaved' socket event.")
      const io = req.app.get("io") as Server
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
        subject,
        timestamp: newMessage.timestamp.toISOString(),
        messageType: messageType,
        messageId: newMessage._id.toString(),
        attachments: attachments,
      }

      if (receiverSocket) {
        console.log(
          `Server Emitting to receiver (socketId): ${receiverSocket.id} for 'emailSaved' payload:`,
          emitPayload,
        )
        receiverSocket.emit("emailSaved", emitPayload)
      }
      if (senderSocket) {
        console.log(
          `Server Emitting to sender (socketId): ${senderSocket.id} for 'emailSaved' payload:`,
          emitPayload,
        )
        senderSocket.emit("emailSaved", emitPayload)
      }
    }

    res.status(201).json({ message: "Message sent and saved.", messageId: newMessage._id })
  } catch (error) {
    console.error("Error in sendMessageController:", error)
    res.status(500).json({ message: "Failed to send message.", error: (error as Error).message })
  }
}
