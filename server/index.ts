import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"

import type { SocketIdMap } from "./lib/types"

import authRoutes from "./routes/auth.route"
import userRoutes from "./routes/user.route"
import messageRoutes from "./routes/message.route"

import { MONGODB_URI, PORT } from "./lib/constants"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/message", messageRoutes)

mongoose
  .connect(MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB.\n++++++++++++++++++++++++++++++"))
  .catch((err) => console.error("MongoDB connection error:", err))

const socketIdMap: SocketIdMap = {}
app.set("socketIdMap", socketIdMap)
app.set("io", io) // Add this line to set 'io' on the app

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string
  if (userId) {
    socketIdMap[userId] = socket.id
  }

  socket.on("disconnect", () => {
    for (const uid in socketIdMap) {
      if (socketIdMap[uid] === socket.id) {
        delete socketIdMap[uid]
        break
      }
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`URL: http://localhost:${PORT}`)
})
