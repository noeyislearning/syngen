import { Socket, Server } from "socket.io"
import type { SocketIdMap } from "../../lib/types"

interface CallData {
  receiverId: string
  callerId: string
  signal?: string
  iceCandidate?: RTCIceCandidateInit
  offer?: RTCSessionDescriptionInit
  answer?: RTCSessionDescriptionInit
}

export const callController = (io: Server, socketIdMap: SocketIdMap) => {
  return {
    handleCallUser: (socket: Socket, data: CallData) => {
      console.log("Current socketIdMap:", socketIdMap)
      const receiverSocketId = socketIdMap[data.receiverId]
      if (receiverSocketId) {
        console.log(
          `Controller: Forwarding 'callUser' signal from ${data.callerId} to ${data.receiverId} (socketId: ${receiverSocketId})`,
        )
        socket
          .to(receiverSocketId)
          .emit("incomingCall", { callerId: data.callerId, signal: data.signal })
      } else {
        console.log(
          `Controller: Receiver ${data.receiverId} socket not found for 'callUser' signal.`,
        )
        socket.emit("callUserFailed", { message: `User ${data.receiverId} is not online.` })
      }
    },

    handleAnswerCall: (socket: Socket, data: CallData & { calleeId?: string }) => {
      const callerSocketId = socketIdMap[data.callerId]
      if (callerSocketId) {
        console.log(`Forwarding answer from ${socket.handshake.query.userId} to ${data.callerId}`)
        socket.to(callerSocketId).emit("answer", {
          answer: data.answer,
          calleeId: socket.handshake.query.userId,
        })
      }
    },

    handleRejectCall: (socket: Socket, data: CallData & { calleeId?: string }) => {
      const callerSocketId = socketIdMap[data.callerId]
      if (callerSocketId) {
        console.log(
          `Controller: Forwarding 'rejectCall' signal from ${socket.handshake.query.userId} to ${data.callerId} (socketId: ${callerSocketId})`,
        )
        socket.to(callerSocketId).emit("callRejected", { calleeId: socket.handshake.query.userId })
      } else {
        console.log(`Controller: Caller ${data.callerId} socket not found for 'rejectCall' signal.`)
      }
    },

    handleIceCandidate: (socket: Socket, data: CallData & { senderId?: string }) => {
      if (!data.iceCandidate || typeof data.iceCandidate !== "object") {
        console.error("Invalid ICE candidate:", data.iceCandidate)
        return
      }

      const receiverSocketId = socketIdMap[data.receiverId]
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("iceCandidate", {
          iceCandidate: {
            candidate: data.iceCandidate.candidate || "",
            sdpMid: data.iceCandidate.sdpMid || null,
            sdpMLineIndex: data.iceCandidate.sdpMLineIndex || 0,
          },
          senderId: socket.handshake.query.userId,
        })
      }
    },

    handleOffer: (socket: Socket, data: CallData) => {
      if (!data.offer || typeof data.offer !== "object") {
        console.error("Invalid offer format:", data.offer)
        return
      }

      const validatedOffer = {
        type: "offer",
        sdp: data.offer.sdp || "",
      }

      const receiverSocketId = socketIdMap[data.receiverId]
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("offer", {
          offer: validatedOffer,
          callerId: data.callerId,
        })
      }
    },

    handleAnswer: (socket: Socket, data: CallData & { calleeId?: string }) => {
      console.log("Server received answer payload:", data)
      if (!data.answer || typeof data.answer !== "object") {
        console.error("Invalid answer format:", data.answer)
        return
      }
      const callerSocketId = socketIdMap[data.callerId]
      if (callerSocketId) {
        socket.to(callerSocketId).emit("answer", data)
        console.log(`Forwarded answer from ${data.calleeId} to ${data.callerId}`)
      } else {
        console.error("Caller socket not found for callerId:", data.callerId)
      }
    },

    handleHangUp: (socket: Socket, data: CallData & { calleeId?: string }) => {
      const receiverId = data.receiverId
      const callerId = data.callerId
      const userId = socket.handshake.query.userId as string
      const receiverSocketId = socketIdMap[receiverId]
      if (receiverSocketId) {
        console.log(
          `Controller: Forwarding 'hangUp' from ${userId} to ${receiverId} (socketId: ${receiverSocketId})`,
        )
        socket.to(receiverSocketId).emit("hangUp", { callerId: userId })
      } else {
        console.log(`Controller: Receiver ${receiverId} socket not found for 'hangUp'.`)
      }

      const callerSocketId = socketIdMap[callerId]
      if (callerSocketId && callerSocketId !== socket.id) {
        console.log(
          `Controller: Also forwarding 'hangUp' to caller ${callerId} (socketId: ${callerSocketId})`,
        )
        socket.to(callerSocketId).emit("hangUp", { calleeId: userId })
      }
    },
  }
}
