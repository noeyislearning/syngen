import express from "express"
import mongoose from "mongoose"
import cors from "cors"

import authRoutes from "./routes/auth.routes"
import { MONGODB_URI, PORT } from "./lib/constants"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * Routes
 */
app.use("/api/v1/auth", authRoutes)

mongoose
  .connect(MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB."))
  .catch((err) => console.error("MongoDB connection error:", err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`http://localhost:${PORT}`)
})
