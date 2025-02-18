import type { Request, Response } from "express"

import { loginService } from "../../services/auth/login.service"

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const result = await loginService(email, password)
    res.status(200).json(result)
  } catch (error) {
    console.error(`[LOGIN ERROR] ${error}`)
    res.status(500).json({
      message: "Login failed.",
      error: (error as Error).message,
    })
  }
}
