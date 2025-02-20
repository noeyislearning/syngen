import mongoose, { Schema } from "mongoose"

import type { ISmsMessage } from "../lib/types"

const smsMessageSchema: Schema = new Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    messageType: { type: String, default: "sms" },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    senderNumber: { type: String, required: true },
    receiverNumber: { type: String, required: true },
  },
  {
    timestamps: false,
  },
)

const SmsMessage = mongoose.model<ISmsMessage>("SmsMessage", smsMessageSchema)

export default SmsMessage
