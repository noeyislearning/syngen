import * as dotenv from "dotenv"

dotenv.config()

export const MONGODB_URI = process.env.MONGODB_URI
export const PORT = process.env.PORT

export const JWT_SECRET = process.env.JWT_SECRET
