import User from "../../models/user.model"
import type { IUser } from "../../lib/types"

export const getUserProfileService = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).select("-passwordHash").exec()
}
