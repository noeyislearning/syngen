import type { Response } from "express"
import { Socket, Server } from "socket.io"

import SmsMessage from "../../models/sms-message.model"

import type { SmsMessagePayload, SendSmsMessageRequest } from "../../lib/types"

export const handleSmsMessage = async (socket: Socket, io: Server, payload: SmsMessagePayload) => {
  console.log("Server handleSmsMessage function called:", payload)
  try {
    const { senderId, receiverId, text, senderNumber, receiverNumber } = payload

    const sms = new SmsMessage({
      senderId,
      receiverId,
      text,
      senderNumber,
      receiverNumber,
    })
    await sms.save()

    const socketIdMap = io.of("/").sockets

    const receiverSocket = Array.from(socketIdMap.values()).find(
      (s: Socket) => s.handshake.query.userId === receiverId,
    )
    const senderSocket = Array.from(socketIdMap.values()).find(
      (s: Socket) => s.handshake.query.userId === senderId,
    )

    if (receiverSocket) {
      console.log("Server Emitting SMS to receiver (socketId):", receiverSocket.id, "payload:", {
        senderId,
        receiverId,
        text,
        senderNumber,
        receiverNumber,
        timestamp: sms.timestamp.toISOString(),
      })
      receiverSocket.emit("smsMessage", {
        senderId,
        receiverId,
        text,
        senderNumber,
        receiverNumber,
        timestamp: sms.timestamp.toISOString(),
      })
    } else {
      console.log(`Receiver socket for userId ${receiverId} not found.`)
    }

    if (senderSocket) {
      console.log("Server Emitting SMS to sender (socketId):", senderSocket.id, "payload:", {
        senderId,
        receiverId,
        text,
        senderNumber,
        receiverNumber,
        timestamp: sms.timestamp.toISOString(),
      })
      senderSocket.emit("smsMessage", {
        senderId,
        receiverId,
        text,
        senderNumber,
        receiverNumber,
        timestamp: sms.timestamp.toISOString(),
      })
    } else {
      console.log(`Sender socket for userId ${senderId} not found.`)
    }

    console.log("SMS message saved and broadcasted:", sms)
  } catch (error) {
    console.error("Error handling SMS message:", error)
    socket.emit("smsMessageError", {
      message: "Failed to send SMS message",
      error: (error as Error).message,
    })
  }
}

export const sendSmsMessageController = async (
  req: SendSmsMessageRequest,
  res: Response,
): Promise<void> => {
  try {
    const { senderId, receiverId, text, senderNumber, receiverNumber } = req.body

    if (!senderId || !receiverId || !text || !senderNumber || !receiverNumber) {
      res.status(400).json({ message: "Missing required fields for SMS." })
      return
    }

    const newSmsMessage = new SmsMessage({
      senderId,
      receiverId,
      messageType: "sms",
      text,
      senderNumber,
      receiverNumber,
    })

    await newSmsMessage.save()

    res.status(201).json({ message: "SMS message sent and saved.", messageId: newSmsMessage._id })
  } catch (error) {
    console.error("Error in sendSmsMessageController:", error)
    res
      .status(500)
      .json({ message: "Failed to send SMS message.", error: (error as Error).message })
  }
}
