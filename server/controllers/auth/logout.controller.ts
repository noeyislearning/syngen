import type { Request, Response } from "express"

import { logoutService } from "../../services/auth/logout.service"

export const logoutController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await logoutService()
    res.status(200).json(result)
  } catch (error) {
    console.error(`Logout error: ${error}`)
    res.status(500).json({
      message: "Logout failed.",
      error: (error as Error).message,
    })
  }
}
