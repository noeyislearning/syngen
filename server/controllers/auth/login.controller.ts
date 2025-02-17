import type { Request, Response } from "express"
import jwt from "jsonwebtoken"

import User from "../../models/user.model"

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." })
      return
    }

    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({ message: "Invalid credentials." })
      return
    }

    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid credentials." })
      return
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    })
    res.status(200).json({ message: "Login successful", token })
  } catch (error) {
    console.error(`Login error: ${error}`)
    res.status(500).json({
      message: "Login failed.",
      error: (error as Error).message,
    })
  }
}
