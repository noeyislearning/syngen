"use client"

import { format } from "date-fns/format"
import * as React from "react"
import { MailIcon, PhoneCall, MessageSquareIcon } from "lucide-react"
import { io } from "socket.io-client"
import { SOCKET_URL } from "@/lib/constants"

import {
  Avatar,
  AvatarFallback,
  Button,
  Separator,
  Textarea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Label,
  Switch,
} from "@/components/shared/"
import { MessageTypeProps } from "@/lib/types"

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
  const [isEmailFilterOn, setIsEmailFilterOn] = React.useState(false)

  // Ref for the message container
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null)

  // Function to scroll to the bottom of the message container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Auto-scroll when chatMessages updates
  React.useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

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
  }, [userId, message?.userId, chatMessages])

  React.useEffect(() => {
    if (message?.messages) {
      console.log("Initial message.messages prop:", message.messages) // Log initial prop
      const initialChatMessages = message.messages.filter((msg) => msg.messageType === "chat")
      setChatMessages(initialChatMessages)
    } else {
      setChatMessages([])
    }
  }, [message])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("handleSendMessage called")
    console.log("socket:", socket)
    console.log("message?.userId:", message?.userId)
    console.log("userId:", userId)
    console.log("messageText.trim():", messageText.trim())

    if (!socket || !message?.userId || !userId || !messageText.trim()) {
      console.log("Input validation failed in handleSendMessage")
      return
    }

    const payload = {
      senderId: userId,
      receiverId: message.userId,
      text: messageText.trim(),
    }

    console.log("Emitting chatMessage from CLIENT:", payload)
    socket.emit("chatMessage", payload)
    setMessageText("")
    console.log("Message text cleared, emit complete")
  }

  const filteredMessages = React.useMemo(() => {
    if (!message?.messages) return []

    let messagesToSort = []
    if (isEmailFilterOn) {
      messagesToSort = message.messages.filter((msg) => msg.messageType === "email")
    } else {
      messagesToSort = chatMessages
    }

    messagesToSort.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : null
      const dateB = b.date ? new Date(b.date) : null

      if (!dateA && !dateB) return 0 // if both dates are null, maintain original order
      if (!dateA) return 1 // if dateA is null or invalid, sort dateB to be earlier
      if (!dateB) return -1 // if dateB is null or invalid, sort dateA to be earlier

      return dateA.getTime() - dateB.getTime() // sort by date ascending (oldest to newest)
    })

    return messagesToSort
  }, [isEmailFilterOn, message?.messages, chatMessages])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" disabled={!message}>
            <PhoneCall className="h-4 w-4 text-emerald-400" />
            <span className="sr-only">Call</span>
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col overflow-auto p-4">
        {!message ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-muted-foreground">No sender selected</div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarFallback className="uppercase">
                  {message.from
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid">
                <div className="font-semibold">{message.from}</div>
                <div className="text-muted-foreground">Phone: {message.phoneNumber}</div>
              </div>
            </div>
            <Separator />
            <div className="mt-4 flex flex-col gap-4 overflow-auto">
              {filteredMessages.map((msg) => (
                <div key={msg.id}>
                  {msg.messageType === "email" && isEmailFilterOn ? (
                    <div
                      className={`relative flex ${
                        msg.isSender ? "ml-auto justify-end" : "justify-start"
                      }`}
                    >
                      <Dialog
                        open={selectedEmailMessage?.id === msg.id}
                        onOpenChange={(open) =>
                          open
                            ? setSelectedEmailMessage(msg as SelectedEmailMessageType)
                            : setSelectedEmailMessage(null)
                        }
                      >
                        <div className="flex w-fit max-w-fit flex-row items-start gap-1">
                          <DialogTrigger asChild>
                            <div className="w-full cursor-pointer whitespace-pre-wrap border border-muted p-3 text-sm">
                              {msg.isSender ? (
                                <div className="flex flex-row items-center justify-end gap-2">
                                  <p className="font-bold">{msg.subject}</p>
                                  <MailIcon className="h-4 w-4 text-blue-600" />
                                </div>
                              ) : (
                                <div className="flex flex-row items-center gap-2">
                                  <MailIcon className="h-4 w-4 text-blue-600" />
                                  <p className="font-bold">{msg.subject}</p>
                                </div>
                              )}
                              <p className="line-clamp-2">{msg.text.substring(0, 300)}</p>
                              {msg.isSender ? (
                                <div className="text-end text-xs text-muted-foreground">
                                  {msg.date ? format(new Date(msg.date), "PPpp") : "N/A"}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {msg.date ? format(new Date(msg.date), "PPpp") : "N/A"}
                                </span>
                              )}
                            </div>
                          </DialogTrigger>
                        </div>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{msg.subject}</DialogTitle>
                            <DialogDescription>
                              {msg.isSender ? `To: ${message.from}` : `From: ${message.from}`}
                              <br />
                              Date: {msg.date ? format(new Date(msg.date), "PPpp") : "N/A"}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="whitespace-pre-wrap py-4">{msg.text}</div>
                          <DialogFooter>
                            <Button>Reply</Button>
                            <Button variant="outline" onClick={() => setSelectedEmailMessage(null)}>
                              Close
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : msg.messageType === "chat" && !isEmailFilterOn ? (
                    <div
                      key={msg.id}
                      className={`flex w-fit max-w-fit ${
                        msg.isSender ? "ml-auto justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col gap-1 rounded-md bg-muted p-3">
                        {msg.isSender ? (
                          <div className="flex items-center justify-end gap-2">
                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                            <MessageSquareIcon className="h-4 w-4 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <MessageSquareIcon className="h-4 w-4 text-emerald-600" />
                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                          </div>
                        )}

                        {msg.isSender ? (
                          <div className="text-end text-xs text-muted-foreground">
                            {msg.date ? format(new Date(msg.date), "PPpp") : "N/A"}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            {msg.date ? format(new Date(msg.date), "PPpp") : "N/A"}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
              {/* Empty div to act as the scroll target */}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>
      <Separator className="mt-auto" />
      {message && (
        <div className="p-4">
          <form onSubmit={handleSendMessage}>
            <div className="grid gap-4">
              <Textarea
                className="p-4"
                placeholder={`Reply to ${message.from}...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <div className="flex items-center">
                <Label
                  htmlFor="email-filter"
                  className="flex items-center gap-2 text-xs font-normal"
                >
                  <Switch
                    id="email-filter"
                    aria-label="Show Emails"
                    checked={isEmailFilterOn}
                    onCheckedChange={setIsEmailFilterOn}
                  />{" "}
                  Show Emails
                </Label>
                <Button size="sm" className="ml-auto" type="submit">
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
