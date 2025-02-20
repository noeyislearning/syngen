"use client"

import { format, isToday, isYesterday } from "date-fns"
import * as React from "react"
import { io } from "socket.io-client"
import { SOCKET_URL } from "@/lib/constants"
import { Separator } from "@/components/shared/"
import { MessageTypeProps } from "@/lib/types"

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
    if (!message?.messages) return []

    let messagesToSort = []
    if (messageFilter === "email") {
      messagesToSort = message.messages.filter((msg) => msg.messageType === "email")
    } else if (messageFilter === "chat") {
      messagesToSort = chatMessages
    } else {
      messagesToSort = chatMessages // Default to chat if filter is not email or chat
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
  }, [messageFilter, message?.messages, chatMessages])

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
      const initialChatMessages = message.messages.filter((msg) => msg.messageType === "chat")
      setChatMessages(initialChatMessages)
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
      "chatMessage",
      (payload: { senderId: string; text: string; timestamp: string }) => {
        console.log("Received chatMessage EVENT in CLIENT:", payload)
        console.log("Current chatMessages state (before update):", chatMessages)
        setChatMessages((prevMessages) => {
          const updatedMessages = [
            ...prevMessages,
            {
              id: Math.random().toString(36).substring(7),
              messageType: "chat",
              isSender: payload.senderId === userId,
              text: payload.text,
              date: payload.timestamp,
            } as MessageTypeProps["messages"][number],
          ]
          console.log("Updated chatMessages state (after update):", updatedMessages)
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
      newSocket.off("chatMessage")
      newSocket.off("chatMessageError")
      newSocket.off("disconnect")
      newSocket.disconnect()
      setSocket(null)
    }
  }, [userId, message?.userId, chatMessages, setChatMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!socket || !message?.userId || !userId || !messageText.trim()) {
      console.log("Input validation failed in handleSendMessage")
      return
    }

    const payload = {
      senderId: userId,
      receiverId: message.userId,
      text: messageText.trim(),
    }

    socket.emit("chatMessage", payload)
    setMessageText("")
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
        />
      )}
    </div>
  )
}
