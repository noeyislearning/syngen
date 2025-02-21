import jwt from "jsonwebtoken"

import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../../lib/constants"
import User from "../../models/user.model"

export const loginService = async (
  email: string,
  password: string,
): Promise<{ message: string; tokens: { access: string; refresh: string } }> => {
  if (!email || !password) {
    throw new Error("Email and password are required.")
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new Error("Invalid credentials.")
  }

  const passwordMatch = await user.comparePassword(password)
  if (!passwordMatch) {
    throw new Error("Invalid credentials.")
  }

  const access = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET as string, {
    expiresIn: "1h",
  })

  const refresh = jwt.sign(
    { userId: user._id, tokenType: "refresh" },
    JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    },
  )
  return { message: "Login successful", tokens: { access, refresh } }
}
