import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import http from "http"
import { Server, Socket } from "socket.io"

import type { SocketIdMap, MessagePayload } from "./lib/types"
import { handleMessage } from "./controllers/message/send-message.controller"
import { callController } from "./controllers/call/call.controller"

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
  transports: ["websocket", "polling"],
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
app.set("io", io)

io.on("connection", (socket: Socket) => {
  const userId = socket.handshake.query.userId as string
  if (userId) {
    socketIdMap[userId] = socket.id
  }

  socket.on("message", (payload: MessagePayload) => {
    handleMessage(socket, io, payload)
  })

  const callHandlers = callController(io, socketIdMap)

  socket.on("callUser", (data) => callHandlers.handleCallUser(socket, data))
  socket.on("answerCall", (data) => callHandlers.handleAnswerCall(socket, data))
  socket.on("rejectCall", (data) => callHandlers.handleRejectCall(socket, data))
  socket.on("iceCandidate", (data) => callHandlers.handleIceCandidate(socket, data))
  socket.on("offer", (data) => callHandlers.handleOffer(socket, data))
  socket.on("answer", (data) => callHandlers.handleAnswer(socket, data))
  socket.on("hangUp", (data) => callHandlers.handleHangUp(socket, data))

  socket.on("disconnect", () => {
    if (userId) {
      delete socketIdMap[userId]
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`URL: http://localhost:${PORT}`)
})
