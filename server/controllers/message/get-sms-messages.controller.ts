import type { Response } from "express"
import { getSmsMessagesService } from "../../services/message/get-sms-messages.service"
import type { AuthRequest, SmsMessageType } from "../../lib/types" // Import SmsMessageType

export const getSmsMessagesController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID missing from request." })
      return
    }

    const messages: SmsMessageType[] = await getSmsMessagesService(userId)
    res.status(200).json(messages)
  } catch (error) {
    console.error("Error in getSmsMessagesController:", error)
    res
      .status(500)
      .json({ message: "Failed to fetch SMS messages.", error: (error as Error).message })
  }
}
