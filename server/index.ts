import express from "express"
import mongoose from "mongoose"
import cors from "cors"

import authRoutes from "./routes/auth.route"
import userRoutes from "./routes/user.route"

import { MONGODB_URI, PORT } from "./lib/constants"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)

mongoose
  .connect(MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB.\n++++++++++++++++++++++++++++++"))
  .catch((err) => console.error("MongoDB connection error:", err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`URL: http://localhost:${PORT}`)
})
