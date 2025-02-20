import mongoose, { Schema } from "mongoose"

import type { IMessage, IAttachment } from "../lib/types"

const attachmentSchema: Schema<IAttachment> = new Schema({
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String }, // Optional: MIME type
})

const chatMessageSchema: Schema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messageType: { type: String, enum: ["chat", "email", "sms"], default: "chat" },
    subject: { type: String, default: null },
    text: { type: String, required: true },
    senderNumber: { type: String, default: null },
    receiverNumber: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
    attachments: [attachmentSchema],
  },
  {
    timestamps: true,
  },
)

const ChatMessage = mongoose.model<IMessage>("ChatMessage", chatMessageSchema)
export default ChatMessage
