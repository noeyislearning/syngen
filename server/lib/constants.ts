import * as dotenv from "dotenv"

dotenv.config()

export const MONGODB_URI = process.env.MONGODB_URI
export const PORT = process.env.PORT

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!
