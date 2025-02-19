import type { Request, Response } from "express"
import jwt from "jsonwebtoken"

import { JWT_ACCESS_SECRET } from "../../lib/constants"
import { getUserProfileService } from "../../services/user/get-user-profile.service"

export const getUserProfileController = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).json({ message: "Authorization header is missing" })
      return
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
      res.status(401).json({ message: "Token is missing" })
      return
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as unknown as { userId: string }

    const userId = decoded.userId
    const user = await getUserProfileService(userId)

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    res.status(200).json(user)
  } catch (error) {
    console.error(`[GET USER PROFILE ERROR] ${error}`)
    res.status(500).json({
      message: "Failed to get user profile.",
      error: (error as Error).message,
    })
  }
}
