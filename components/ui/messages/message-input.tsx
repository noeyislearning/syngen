"use client"

import * as React from "react"
import { Button, Textarea, Input } from "@/components/shared/"
import { MessageTypeProps } from "@/lib/types"

interface MessageInputProps {
  messageText: string
  setMessageText: React.Dispatch<React.SetStateAction<string>>
  handleSendMessage: (
    e: React.FormEvent,
    messageType: string,
    subject?: string,
    files?: FileList | null, // Add files as optional parameter
  ) => Promise<void> // Changed return type to Promise<void> to match handleSendMessage in MessageDisplay
  message: MessageTypeProps | null
  messageFilter: string
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>> // Add setFiles prop to MessageInputProps
  files: FileList | null // Add files prop to MessageInputProps
}

export const MessageInput: React.FC<MessageInputProps> = ({
  messageText,
  setMessageText,
  handleSendMessage,
  message,
  messageFilter,
  setFiles, // Destructure setFiles prop
  files, // Destructure files prop
}) => {
  const [subject, setSubject] = React.useState("")
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(files) // Initialize selectedFiles with files prop, and remove useState and use prop directly instead

  React.useEffect(() => {
    setSelectedFiles(files) // Keep the selected files state in sync with the prop
  }, [files])

  const handleSubmit = async (e: React.FormEvent) => {
    // Make handleSubmit async to handle Promise return of handleSendMessage
    e.preventDefault()
    if (messageFilter === "email") {
      await handleSendMessage(e, "email", subject, selectedFiles) // Pass files to handleSendMessage and await the promise
    } else if (messageFilter === "chat") {
      await handleSendMessage(e, "chat", undefined, selectedFiles) // Pass files for chat as well and await the promise
    } else if (messageFilter === "sms") {
      await handleSendMessage(e, "sms") // Await the promise for sms as well for consistency even if SMS doesn't use files now
    }
    setSubject("")
    setMessageText("")
    setFiles(null) // Clear selected files after sending using setFiles prop
    setSelectedFiles(null) // Also clear local selectedFiles state for consistency - although prop should be source of truth now
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files) // Update local selectedFiles state
    setFiles(e.target.files) // Update files state in parent component via setFiles prop
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

          {messageFilter === "email" && (
            <Input type="file" id="message-files" className="" onChange={handleFileChange} />
          )}

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
