import type { Request, Response } from "express"
import bcrypt from "bcrypt"

import User from "../../models/user.model"

export const register = async (req: Request, res: Response): Promise<void> => {
  // Explicitly set return type to Promise<void>
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required.",
      })
      return
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(409).json({ message: "Email already exists." })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ email, passwordHash })
    await user.save()

    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    console.error(`Registration error: ${error}`)
    res.status(500).json({
      message: "Registration failed.",
      error: (error as Error).message,
    })
  }
}
