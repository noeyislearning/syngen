import bcrypt from "bcrypt"

import User from "../../models/user.model"

export const registerService = async (
  email: string,
  password: string,
  phoneNumber: string, // ADDED PHONE NUMBER PARAMETER
): Promise<{ message: string } | { message: string; errors: Record<string, string> }> => {
  const errors: Record<string, string> = {}

  if (!email) {
    errors.email = "Email is required"
  }
  if (!password) {
    errors.password = "Password is required"
  }
  if (!phoneNumber) {
    // ADDED PHONE NUMBER VALIDATION
    errors.phoneNumber = "Phone number is required"
  }

  if (Object.keys(errors).length > 0) {
    return { message: "Registration failed due to validation errors.", errors }
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return {
      message: "Registration failed due to validation errors.",
      errors: { email: "Email already exists." },
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ email, passwordHash, phoneNumber })
  await user.save()
  return { message: "User created successfully" }
}
