import { Document, Schema } from "mongoose"
import type { Request } from "express"

/**
 * MODELS
 * 1. User Model
 * 2. Chat Message Model
 */
export interface IUser extends Document {
  email: string
  passwordHash: string
  phoneNumber: string
  from?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}
export interface IMessage extends Document {
  _id: Schema.Types.ObjectId
  senderId: Schema.Types.ObjectId | IUser
  receiverId: Schema.Types.ObjectId
  messageType: "chat" | "email" | "sms"
  subject?: string | null
  text: string
  timestamp: Date
  senderNumber?: string | null
  receiverNumber?: string | null
}
/**
 * CONTROLLERS
 * 1. Auth Controllers
 */
export interface AuthRequest extends Request {
  user?: { userId: string }
}
/**
 * SERVICES
 * 1. Message Services
 */
export interface SocketIdMap {
  [userId: string]: string
}
export interface MessagePayload {
  senderId: string
  receiverId: string
  text: string
}
export interface SendMessageRequest extends Request {
  body: {
    senderId: string
    receiverId: string
    messageType: "chat" | "email" | "sms"
    text: string
    subject?: string
    senderNumber?: string | null
    receiverNumber?: string | null
  }
}
export interface MessageDetail {
  id: string
  messageType: string
  name: string
  subject: string | null
  text: string
  date: string
  isSender: boolean
}
export interface SmsMessageType {
  userId: string
  to: string
  email: string
  phoneNumber: string
  messages: MessageDetail[]
}
export interface MessageType {
  userId: string
  from: string
  email: string
  phoneNumber: string
  messages: MessageDetail[]
}
export interface ISmsMessage {
  senderId: string
  receiverId: string
  messageType: "sms"
  text: string
  timestamp: Date
  senderNumber: string
  receiverNumber: string
  _id?: string
}
