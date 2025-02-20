"use client"

import * as React from "react"
import { Button, Textarea } from "@/components/shared/"
import { MessageTypeProps } from "@/lib/types"

interface MessageInputProps {
  messageText: string
  setMessageText: React.Dispatch<React.SetStateAction<string>>
  handleSendMessage: (e: React.FormEvent) => void
  message: MessageTypeProps | null
}

export const MessageInput: React.FC<MessageInputProps> = ({
  messageText,
  setMessageText,
  handleSendMessage,
  message,
}) => {
  return (
    <div className="p-4">
      <form onSubmit={handleSendMessage}>
        <div className="grid gap-4">
          <Textarea
            className="p-4"
            placeholder={`Reply to ${message?.from}...`}
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
