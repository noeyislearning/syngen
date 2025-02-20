import mongoose, { Schema } from "mongoose"

import type { IMessage } from "../lib/types"

const messageSchema: Schema = new Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    messageType: { type: String, default: "chat" },
    subject: { type: String },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    senderNumber: { type: String, default: null },
    receiverNumber: { type: String, default: null },
  },
  {
    timestamps: false,
  },
)

const Message = mongoose.model<IMessage>("Message", messageSchema)

export default Message
export type { IMessage }
