import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"

import type { IUser } from "../lib/types"

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash)
}

export default mongoose.model<IUser>("User", UserSchema)
