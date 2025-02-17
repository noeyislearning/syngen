import type { Request, Response } from "express"

export const logout = (req: Request, res: Response): void => {
  res.status(200).json({ message: "Logged out successfully." })
}
