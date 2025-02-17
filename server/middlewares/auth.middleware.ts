import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import type { JwtPayload, Secret } from "jsonwebtoken"

import type { AuthRequest } from "../lib/types"
import { JWT_SECRET } from "../lib/constants"

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    res.status(401).json({
      message: "Authentication required. No token provided.",
    })
    return
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined. Authentication middleware cannot function.")
    res.status(500).json({
      message: "Server configuration error: JWT secret is missing.",
    })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as Secret) as JwtPayload
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      typeof decoded.userId === "string"
    ) {
      req.user = { userId: decoded.userId }
      next()
    } else {
      console.error("Token verification successful, but payload is invalid or missing userId.")
      res.status(401).json({
        message: "Authentication failed: Invalid token payload.",
      })
      return
    }
  } catch (error) {
    console.error(`Token verification error: ${error}`)
    res.status(401).json({
      message: "Authentication failed: Invalid token.",
      error: (error as Error).message,
    })
    return
  }
}
