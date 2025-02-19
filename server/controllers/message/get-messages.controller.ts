import type { Response } from "express"
import { getMessagesService } from "../../services/message/get-messages.service"
import type { AuthRequest } from "../../lib/types"

export const getMessagesController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID missing from request." })
      return
    }

    const messages = await getMessagesService(userId)
    res.status(200).json(messages)
  } catch (error) {
    console.error("Error in getInboxMessagesController:", error)
    res
      .status(500)
      .json({ message: "Failed to fetch inbox messages.", error: (error as Error).message })
  }
}
