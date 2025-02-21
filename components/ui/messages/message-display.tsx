"use client"

import { format, isToday, isYesterday } from "date-fns"
import * as React from "react"
import { io } from "socket.io-client"
import { SOCKET_URL } from "@/lib/constants"
import { Separator } from "@/components/shared/"
import { MessageTypeProps, IAttachment } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { useUser } from "@/hooks/use-user"

import { ContactInfo } from "./contact-info"
import { MessageFilter } from "./message-filter"
import { MessageCard } from "./message-card"
import { MessageInput } from "./message-input"
import { VoiceCall, VoiceCallUI } from "./voice-call"
import { IncomingVoiceCall } from "./incoming-voice-call"

interface MessageDisplayProps {
  message: MessageTypeProps | null
  userId?: string | null
}

type SelectedEmailMessageType = MessageTypeProps["messages"][number] | null

const configuration = {
  iceServers: [{ urls: "stun:stunprotocol.org" }],
}

export function MessageDisplay({ message, userId }: MessageDisplayProps) {
  const [selectedEmailMessage, setSelectedEmailMessage] =
    React.useState<SelectedEmailMessageType>(null)
  const [chatMessages, setChatMessages] = React.useState<MessageTypeProps["messages"]>([])
  const [socket, setSocket] = React.useState<ReturnType<typeof io> | null>(null)
  const [messageText, setMessageText] = React.useState("")
  const [messageFilter, setMessageFilter] = React.useState<string>("chat")
  const [incomingCallerId, setIncomingCallerId] = React.useState<string | null>(null)
  const [isCalling, setIsCalling] = React.useState<boolean>(false)
  const [receiverNameForCall, setReceiverNameForCall] = React.useState<string | null>(null)
  const [isMuted, setIsMuted] = React.useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const [peerConnection, setPeerConnection] = React.useState<RTCPeerConnection | null>(null)
  const peerConnectionRef = React.useRef<RTCPeerConnection | null>(null)
  const [localStream, setLocalStream] = React.useState<MediaStream | null>(null)
  const [files, setFiles] = React.useState<FileList | null>(null)

  const filteredMessages = React.useMemo(() => {
    if (!chatMessages) return []

    let messagesToSort = []
    if (messageFilter === "email") {
      messagesToSort = chatMessages.filter((msg) => msg.messageType === "email")
    } else if (messageFilter === "chat") {
      messagesToSort = chatMessages.filter((msg) => msg.messageType === "chat")
    } else if (messageFilter === "sms") {
      messagesToSort = chatMessages.filter((msg) => msg.messageType === "sms")
    } else {
      messagesToSort = chatMessages
    }

    messagesToSort.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : null
      const dateB = b.date ? new Date(b.date) : null

      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1

      return dateA.getTime() - dateB.getTime()
    })

    return messagesToSort
  }, [messageFilter, chatMessages])

  const formatDateDisplay = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    if (isToday(date)) {
      return format(date, "pp")
    } else if (isYesterday(date)) {
      return "Yesterday"
    } else {
      return format(date, "MMM d,")
    }
  }

  React.useEffect(() => {
    if (message?.messages) {
      setChatMessages(message.messages)
    }
  }, [message])

  React.useEffect(() => {
    if (!userId || !message?.userId) return

    const setupSocket = () => {
      const socket = io(SOCKET_URL, {
        query: { userId: userId },
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        withCredentials: true,
      })

      socket.on("connect", () => {
        console.log(`Socket connected: ${socket.id}`)
      })

      socket.on("connect_error", (err) => {
        console.log("Connection Error:", err.message)
      })

      socket.on("reconnect_attempt", (attempt) => {
        console.log("Reconnection Attempt:", attempt)
      })

      socket.on("reconnect_failed", () => {
        console.log("Reconnection Failed")
      })

      socket.on(
        "message",
        (payload: {
          senderId: string
          text: string
          timestamp: string
          messageType: string
          messageId: string
          attachments?: IAttachment[]
        }) => {
          setChatMessages((prev) => {
            const messageExists = prev.some((m) => m.id === payload.messageId)
            if (messageExists) {
              console.log("Duplicate message received via socket, ignoring.")
              return prev
            }
            const newMessage = {
              id: payload.messageId,
              messageType: payload.messageType,
              isSender: payload.senderId === userId,
              text: payload.text,
              date: payload.timestamp,
              attachments: payload.attachments || [],
            } as MessageTypeProps["messages"][number]
            return [...prev, newMessage]
          })
        },
      )

      socket.on(
        "emailSaved",
        (payload: {
          senderId: string
          receiverId: string
          text: string
          subject: string
          timestamp: string
          messageType: string
          messageId: string
          attachments?: IAttachment[]
        }) => {
          setChatMessages((prev) => {
            const messageExists = prev.some((m) => m.id === payload.messageId)
            if (messageExists) {
              console.log("Duplicate emailSaved message received via socket, ignoring.")
              return prev
            }
            const newMessage = {
              id: payload.messageId,
              messageType: payload.messageType,
              isSender: payload.senderId === userId,
              text: payload.text,
              date: payload.timestamp,
              subject: payload.subject,
              attachments: payload.attachments || [],
            } as MessageTypeProps["messages"][number]
            return [...prev, newMessage]
          })
        },
      )

      socket.on("incomingCall", handleIncomingCall)
      socket.on("callAnswered", handleCallAnswered)
      socket.on("offer", handleOffer)
      socket.on("answer", handleAnswer)
      socket.on("iceCandidate", handleIceCandidate)
      socket.on("hangUp", handleRemoteHangUp)

      socket.on("chatMessageError", (error: Error) => {
        console.error("Chat message error:", error)
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected")
      })

      return socket
    }

    const newSocket = setupSocket()
    setSocket(newSocket)

    return () => {
      if (newSocket) {
        console.log("Disconnecting socket")
        newSocket.off("connect")
        newSocket.off("message")
        newSocket.off("chatMessageError")
        newSocket.off("disconnect")
        newSocket.off("incomingCall")
        newSocket.off("callAnswered")
        newSocket.off("offer")
        newSocket.off("answer")
        newSocket.off("iceCandidate")
        newSocket.off("hangUp")
        newSocket.disconnect()
      }
      setSocket(null)
    }
  }, [userId, message?.userId])

  const { user } = useUser()

  const handleSendMessage = async (
    e: React.FormEvent,
    messageType: string,
    subject?: string,
    files?: FileList | null,
  ) => {
    e.preventDefault()

    const selectedFiles = files

    if (messageType === "chat") {
      if (!socket || !message?.userId || !userId || !messageText.trim()) {
        return
      }

      const formData = new FormData()
      formData.append("senderId", userId)
      formData.append("receiverId", message.userId)
      formData.append("messageType", "chat")
      formData.append("text", messageText.trim())

      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("attachments", selectedFiles[i])
        }
      }

      console.log("FormData before sending CHAT message:", formData)

      for (const pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1])
      }

      try {
        const response = await apiClient("/message/messages", "POST", formData)
        console.log("Chat message send response:", response)
      } catch (error) {
        console.error("Error sending chat message:", error)
      }
      setMessageText("")
      setFiles(null)
    } else if (messageType === "email") {
      if (!message?.userId || !userId || !messageText.trim() || !subject?.trim()) {
        return
      }

      const formData = new FormData()
      formData.append("senderId", userId)
      formData.append("receiverId", message.userId)
      formData.append("messageType", "email")
      formData.append("subject", subject.trim())
      formData.append("text", messageText.trim())

      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("attachments", selectedFiles[i])
        }
      }

      console.log("FormData before sending EMAIL message:", formData)

      for (const pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1])
      }

      try {
        const response = await apiClient("/message/messages", "POST", formData)
        console.log("Email send response:", response)
      } catch (error) {
        console.error("Error sending email:", error)
      }

      setMessageText("")
      setFiles(null)
    } else if (messageType === "sms") {
      if (
        !message?.userId ||
        !userId ||
        !messageText.trim() ||
        !message?.phoneNumber ||
        !message?.phoneNumber
      ) {
        return
      }

      const smsPayload = {
        senderId: userId,
        receiverId: message.userId,
        messageType: "sms",
        text: messageText.trim(),
        senderNumber: user?.phoneNumber,
        receiverNumber: message.phoneNumber,
      }

      try {
        const response = await apiClient("/message/messages", "POST", smsPayload)
        console.log("SMS send response:", response)
      } catch (error) {
        console.error("Error sending SMS:", error)
      }

      setMessageText("")
    }
  }

  const startCall = async () => {
    console.log("Initiating call...")
    setIsCalling(true)
    setDialogOpen(true)

    console.log("startCall: Initializing RTCPeerConnection")
    const pc = new RTCPeerConnection(configuration)
    setPeerConnection(pc)
    peerConnectionRef.current = pc

    if (socket && message?.userId && userId) {
      socket.emit("callUser", {
        receiverId: message.userId,
        callerId: userId,
      })
    } else {
      console.error("Socket, receiverId, or userId missing. Cannot initiate call.")
      setIsCalling(false)
      setDialogOpen(false)
      return null
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      setLocalStream(stream)

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream)
      })

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("ICE candidate sent")
          socket?.emit("iceCandidate", {
            receiverId: message?.userId,
            iceCandidate: event.candidate,
          })
        }
      }

      pc.ontrack = (event) => {
        event.streams[0].getAudioTracks().forEach((track) => {
          track.enabled = true
        })
        console.log("Track event received:", event.streams[0])
      }

      pc.onnegotiationneeded = async () => {
        try {
          const offer = await pc.createOffer()
          console.log("Created offer:", offer)

          if (!offer.sdp) {
            throw new Error("Failed to generate valid SDP")
          }

          await pc.setLocalDescription(offer)
          socket?.emit("offer", {
            receiverId: message?.userId,
            offer: {
              type: offer.type,
              sdp: offer.sdp,
            },
            callerId: userId,
          })
        } catch (error) {
          console.error("Error creating/sending offer:", error)
        }
      }

      return pc
    } catch (error) {
      console.error("Error starting call:", error)
      setIsCalling(false)
      setDialogOpen(false)
      setLocalStream(null)
      setPeerConnection(null)
      peerConnectionRef.current = null
      return null
    }
  }

  const handleInitiateCall = async () => {
    console.log("Initiating call...")
    setIsCalling(true)
    setDialogOpen(true)

    const pc = await startCall()
    if (!pc) {
      setIsCalling(false)
      setDialogOpen(false)
    }
  }

  const handleAnswerIncomingCall = async () => {
    console.log("handleAnswerIncomingCall START", peerConnection)
    console.log("Answer call button clicked!")
    setIsCalling(true)
    setDialogOpen(true)
    setReceiverNameForCall(message?.from || null)

    if (!socket || !incomingCallerId || !userId) {
      console.error("Socket not initialized or missing user IDs for answering call")
      setIncomingCallerId(null)
      return
    }
  }

  const handleRejectIncomingCall = () => {
    console.log("Reject call button clicked!")
    setIncomingCallerId(null)
    socket?.emit("rejectCall", { callerId: incomingCallerId, receiverId: userId })
  }

  const handleHangUpCall = () => {
    console.log("Hanging up call in MessageDisplay")
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
      setPeerConnection(null)
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
    }
    setIsCalling(false)
    setDialogOpen(false)
    socket?.emit("hangUp", {
      receiverId: message?.userId,
      callerId: userId,
    })
  }

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
      setIsMuted(!isMuted)
    }
  }

  const handleIncomingCall = async (data: { callerId: string }) => {
    console.log("handleIncomingCall START")
    setIncomingCallerId(data.callerId)
    console.log("Pre-initializing WebRTC for incoming call from:", data.callerId)

    console.log("handleIncomingCall: Initializing RTCPeerConnection at the start")
    const pc = new RTCPeerConnection(configuration)
    setPeerConnection(pc)
    peerConnectionRef.current = pc
    console.log("handleIncomingCall: RTCPeerConnection initialized:", peerConnectionRef.current)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      setLocalStream(stream)

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream)
      })

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("ICE candidate (pre-init) sent from answerer")
          socket?.emit("iceCandidate", {
            receiverId: data.callerId,
            iceCandidate: event.candidate,
          })
        }
      }

      pc.ontrack = (event) => {
        event.streams[0].getAudioTracks().forEach((track) => {
          track.enabled = true
        })
        console.log("Track event received (pre-init) on answerer side:", event.streams[0])
      }

      pc.onnegotiationneeded = () => {}

      console.log("WebRTC pre-initialized for incoming call.")
      console.log("handleIncomingCall END")
    } catch (error) {
      console.error("Error pre-initializing WebRTC for incoming call:", error)
      setIncomingCallerId(null)
      console.log("handleIncomingCall END with error")
    }
  }

  const handleCallAnswered = async (data: {
    answer: RTCSessionDescriptionInit
    calleeId: string
  }) => {
    console.log("'callAnswered' event received:", data)
    if (!peerConnectionRef.current) {
      console.error("Peer connection not initialized when 'callAnswered' received.")
      return
    }
    const pc = peerConnectionRef.current
    try {
      await pc.setRemoteDescription(data.answer)
      console.log("Remote description set from answer")
    } catch (error) {
      console.error("Error setting remote description from answer:", error)
    }
  }

  const handleOffer = async (data: { offer: RTCSessionDescriptionInit; callerId: string }) => {
    if (!data.offer || !data.offer.type || !data.offer.sdp) {
      console.error("Invalid offer received:", data.offer)
      return
    }
    console.log("handleOffer ENTER", peerConnectionRef.current)
    if (!peerConnectionRef.current) return

    const pc = peerConnectionRef.current
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
      console.log("Remote description set from offer")

      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      console.log("Emitting answer with:", {
        callerId: data.callerId,
        answer: { type: answer.type, sdp: answer.sdp },
        calleeId: userId,
      })
      socket?.emit("answer", {
        callerId: data.callerId,
        answer: { type: answer.type, sdp: answer.sdp },
        calleeId: userId,
      })
    } catch (error) {
      console.error("Error handling offer:", error)
    }
  }

  const handleAnswer = async (data: { answer: RTCSessionDescriptionInit; calleeId: string }) => {
    console.log("'answer' event received:", data)
    if (!data.answer || !data.answer.type || !data.answer.sdp) {
      console.error("Invalid answer received:", data.answer)
      return
    }
    if (!peerConnectionRef.current) {
      console.error("Peer connection not initialized when 'answer' received.")
      return
    }
    const pc = peerConnectionRef.current
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
      console.log("Remote description set from answer")
    } catch (error) {
      console.error("Error setting remote description from answer:", error)
    }
  }

  const handleIceCandidate = async (data: {
    iceCandidate: RTCIceCandidateInit
    senderId: string
  }) => {
    console.log("handleIceCandidate ENTER", peerConnectionRef.current)
    if (!peerConnectionRef.current) {
      console.error("Peer connection not initialized when 'iceCandidate' received.")
      return
    }
    console.log("handleIceCandidate: Peer connection is initialized:", peerConnectionRef.current)
    const pc = peerConnectionRef.current
    try {
      await pc.addIceCandidate(
        new RTCIceCandidate({
          candidate: data.iceCandidate.candidate,
          sdpMid: data.iceCandidate.sdpMid,
          sdpMLineIndex: data.iceCandidate.sdpMLineIndex,
        }),
      )
      console.log("ICE candidate added")
    } catch (error) {
      console.error("Error adding ice candidate:", error)
    }
  }

  const handleRemoteHangUp = () => {
    console.log("Remote user hung up.")
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
      setPeerConnection(null)
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
    }
    setIsCalling(false)
    setDialogOpen(false)
    socket?.emit("hangUp", {
      receiverId: message?.userId,
      callerId: userId,
    })
  }

  return (
    <div className="flex h-full flex-col">
      <Separator />
      <div className="mt-12 flex flex-1 flex-col overflow-auto p-4">
        {!message ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-muted-foreground">No sender selected</div>
          </div>
        ) : (
          <>
            <div className="flex w-full flex-row items-center justify-between">
              <ContactInfo message={message} />
              <div className="flex flex-row items-center gap-4">
                <MessageFilter messageFilter={messageFilter} setMessageFilter={setMessageFilter} />
                {isCalling ? (
                  <VoiceCallUI
                    onHangUp={handleHangUpCall}
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    receiverName={receiverNameForCall}
                  />
                ) : (
                  <VoiceCall
                    receiverName={receiverNameForCall}
                    receiverPhoneNumber={message?.phoneNumber}
                    onCallInitiate={handleInitiateCall}
                    socket={socket}
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                  />
                )}
              </div>
            </div>
            <MessageCard
              filteredMessages={filteredMessages}
              messageFilter={messageFilter}
              formatDateDisplay={formatDateDisplay}
              selectedEmailMessage={selectedEmailMessage}
              setSelectedEmailMessage={setSelectedEmailMessage}
              message={message}
            />
          </>
        )}
      </div>
      <Separator className="mt-auto" />
      {message && (
        <MessageInput
          messageText={messageText}
          setMessageText={setMessageText}
          handleSendMessage={handleSendMessage}
          message={message}
          messageFilter={messageFilter}
          setFiles={setFiles}
          files={files}
        />
      )}

      {incomingCallerId && (
        <IncomingVoiceCall
          callerId={incomingCallerId}
          onAnswer={handleAnswerIncomingCall}
          onReject={handleRejectIncomingCall}
        />
      )}
    </div>
  )
}
