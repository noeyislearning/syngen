import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"

import type { IUser } from "../lib/types"

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    from: { type: String },
  },
  {
    timestamps: true,
  },
)

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash)
}

const User = mongoose.model<IUser>("User", userSchema)

export default User
export type { IUser }
