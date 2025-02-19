import ChatMessage from "../../models/message.model"
import User from "../../models/user.model"
import type { IMessage, IUser, MessageType, MessageDetail } from "../../lib/types"
import * as mongoose from "mongoose"

export const getMessagesService = async (userId: string) => {
  try {
    const objectIdUserId = new mongoose.Types.ObjectId(userId)

    const messages = (await ChatMessage.find({
      $or: [{ receiverId: { $eq: objectIdUserId } }, { senderId: { $eq: objectIdUserId } }],
    })
      .populate({
        path: "senderId",
        select: "email from phoneNumber",
        model: User,
      })
      .populate({
        path: "receiverId",
        select: "email from phoneNumber",
        model: User,
      })
      .sort({ timestamp: -1 })
      .exec()) as (mongoose.Document<unknown, mongoose.SchemaDefinition<IMessage>, IMessage> &
      IMessage)[]

    if (!messages) {
      return []
    }

    const groupedMessages: { [userId: string]: MessageType } = messages.reduce(
      (acc: { [userId: string]: MessageType }, message) => {
        const sender = message.populated("senderId") ? (message.senderId as unknown as IUser) : null
        const receiver = message.populated("receiverId")
          ? (message.receiverId as unknown as IUser)
          : null

        if (!sender || !receiver) {
          return acc
        }

        const senderId = sender._id?.toString()
        const receiverId = receiver._id?.toString()

        if (!senderId || !receiverId) {
          return acc
        }

        const otherUserId = senderId === userId ? receiverId : senderId
        const otherUserFrom =
          senderId === userId ? receiver.from || receiver.email : sender.from || sender.email
        const otherUserEmail = senderId === userId ? receiver.email : sender.email
        const otherUserPhoneNumber = senderId === userId ? receiver.phoneNumber : sender.phoneNumber

        if (!acc[otherUserId]) {
          acc[otherUserId] = {
            userId: otherUserId,
            from: otherUserFrom,
            email: otherUserEmail,
            phoneNumber: otherUserPhoneNumber || "N/A",
            messages: [],
          }
        }

        const messageSubject: string | null =
          message.subject === undefined || message.subject === null ? null : message.subject

        const messageDetail: MessageDetail = {
          id: message._id.toString(),
          messageType: message.messageType,
          name: senderId === userId ? receiver.from || receiver.email : sender.from || sender.email,
          subject: messageSubject,
          text: message.text,
          date: message.timestamp.toISOString(),
          isSender: senderId === userId,
        }
        acc[otherUserId].messages.push(messageDetail)

        return acc
      },
      {},
    )

    const messageList = Object.values(groupedMessages) as MessageType[]
    return messageList
  } catch (error) {
    console.error("Error in getInboxMessagesService:", error)
    throw new Error("Failed to fetch inbox messages.")
  }
}
