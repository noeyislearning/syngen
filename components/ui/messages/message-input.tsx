"use client"

import * as React from "react"
import { Button, Textarea, Input } from "@/components/shared/"
import { MessageTypeProps } from "@/lib/types"

interface MessageInputProps {
  messageText: string
  setMessageText: React.Dispatch<React.SetStateAction<string>>
  handleSendMessage: (e: React.FormEvent, messageType: string, subject?: string) => void
  message: MessageTypeProps | null
  messageFilter: string
}

export const MessageInput: React.FC<MessageInputProps> = ({
  messageText,
  setMessageText,
  handleSendMessage,
  message,
  messageFilter,
}) => {
  const [subject, setSubject] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageFilter === "email") {
      handleSendMessage(e, "email", subject)
    } else if (messageFilter === "sms") {
      // Call handleSendMessage with 'sms' type
      handleSendMessage(e, "sms")
    } else {
      handleSendMessage(e, "chat")
    }
    setSubject("")
    setMessageText("")
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          {messageFilter === "email" && (
            <Input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="p-4"
            />
          )}
          <Textarea
            className="p-4"
            placeholder={
              messageFilter === "email"
                ? `Write your email to ${message?.from}...`
                : messageFilter === "sms"
                  ? `Write your SMS to ${message?.phoneNumber}...`
                  : `Reply to ${message?.from}...`
            }
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <div className="flex items-center">
            <Button size="sm" className="ml-auto" type="submit">
              Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
