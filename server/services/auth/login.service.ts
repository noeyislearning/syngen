import jwt from "jsonwebtoken"

import User from "../../models/user.model"

export const loginService = async (
  email: string,
  password: string,
): Promise<{ message: string; token: string }> => {
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

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  })
  return { message: "Login successful", token }
}
