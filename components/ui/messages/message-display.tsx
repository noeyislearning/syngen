"use client"

import { format, isToday, isYesterday } from "date-fns"
import * as React from "react"
import { io } from "socket.io-client"
import { SOCKET_URL } from "@/lib/constants"
import { Separator } from "@/components/shared/"
import { MessageTypeProps } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { useUser } from "@/hooks/use-user"

import { ContactInfo } from "./contact-info"
import { MessageFilter } from "./message-filter"
import { MessageCard } from "./message-card"
import { MessageInput } from "./message-input"

interface MessageDisplayProps {
  message: MessageTypeProps | null
  userId?: string | null
}

type SelectedEmailMessageType = MessageTypeProps["messages"][number] | null

export function MessageDisplay({ message, userId }: MessageDisplayProps) {
  const [selectedEmailMessage, setSelectedEmailMessage] =
    React.useState<SelectedEmailMessageType>(null)
  const [chatMessages, setChatMessages] = React.useState<MessageTypeProps["messages"]>([])
  const [socket, setSocket] = React.useState<ReturnType<typeof io> | null>(null)
  const [messageText, setMessageText] = React.useState("")
  const [messageFilter, setMessageFilter] = React.useState<string>("chat")

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

    const newSocket = io(SOCKET_URL, {
      query: { userId: userId },
    })

    setSocket(newSocket)

    newSocket.on("connect", () => {
      console.log(`Socket connected: ${newSocket.id}`)
    })

    newSocket.on(
      "message",
      (payload: { senderId: string; text: string; timestamp: string; messageType: string }) => {
        console.log("Received message EVENT in CLIENT:", payload)
        console.log("Current chatMessages state (before message update):", chatMessages)
        setChatMessages((prevMessages) => {
          const updatedMessages = [
            ...prevMessages,
            {
              id: Math.random().toString(36).substring(7),
              messageType: payload.messageType,
              isSender: payload.senderId === userId,
              text: payload.text,
              date: payload.timestamp,
            } as MessageTypeProps["messages"][number],
          ]
          console.log("Updated chatMessages state (after message update):", updatedMessages)
          return updatedMessages
        })
      },
    )

    newSocket.on("chatMessageError", (error: Error) => {
      console.error("Chat message error:", error)
    })

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected")
    })

    return () => {
      console.log("Disconnecting socket")
      newSocket.off("connect")
      newSocket.off("message")
      newSocket.off("chatMessageError")
      newSocket.off("disconnect")
      newSocket.disconnect()
      setSocket(null)
    }
  }, [userId, message?.userId, chatMessages, setChatMessages])

  const { user } = useUser()

  const handleSendMessage = async (e: React.FormEvent, messageType: string, subject?: string) => {
    e.preventDefault()

    if (messageType === "chat") {
      if (!socket || !message?.userId || !userId || !messageText.trim()) {
        return
      }

      const payload = {
        senderId: userId,
        receiverId: message.userId,
        text: messageText.trim(),
      }

      try {
        const response = await apiClient("/message/messages", "POST", {
          ...payload,
          messageType: "chat",
        })
        console.log("Chat message send response:", response)
      } catch (error) {
        console.error("Error sending chat message:", error)
      }
      setMessageText("")
    } else if (messageType === "email") {
      if (!message?.userId || !userId || !messageText.trim() || !subject?.trim()) {
        return
      }

      setMessageText("")
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
              <MessageFilter messageFilter={messageFilter} setMessageFilter={setMessageFilter} />
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
        />
      )}
    </div>
  )
}
