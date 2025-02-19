import type { Request, Response } from "express"

import { registerService } from "../../services/user/register.service"

export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, phoneNumber } = req.body

    const result = await registerService(email, password, phoneNumber)
    if ("errors" in result) {
      res.status(400).json({ message: result.message, errors: result.errors })
    } else {
      res.status(201).json(result)
    }
  } catch (error) {
    console.error(`[REGISTRATION ERROR] ${error}`)
    res.status(500).json({
      message: "Registration failed.",
      error: (error as Error).message,
    })
  }
}
