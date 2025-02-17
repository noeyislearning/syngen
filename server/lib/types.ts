import { Document } from "mongoose"
import type { Request } from "express"

/**
 * MODELS
 * 1. User Model
 */
export interface IUser extends Document {
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}
/**
 * CONTROLLERS
 * 1. Auth Controllers
 */
export interface AuthRequest extends Request {
  user?: { userId: string }
}
