import bcrypt from "bcrypt"

import User from "../../models/user.model"

export const registerService = async (
  email: string,
  password: string,
): Promise<{ message: string }> => {
  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error("Email already exists.")
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ email, passwordHash })
  await user.save()
  return { message: "User created successfully" }
}
