import type { Request, Response } from "express"

import { registerService } from "../../services/auth/register.service"

export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const result = await registerService(email, password)
    res.status(201).json(result)
  } catch (error) {
    console.error(`Registration error: ${error}`)
    res.status(500).json({
      message: "Registration failed.",
      error: (error as Error).message,
    })
  }
}
