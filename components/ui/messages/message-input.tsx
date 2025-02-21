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
    files?: FileList | null,
  ) => Promise<void>
  message: MessageTypeProps | null
  messageFilter: string
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>
  files: FileList | null
}

export const MessageInput: React.FC<MessageInputProps> = ({
  messageText,
  setMessageText,
  handleSendMessage,
  message,
  messageFilter,
  setFiles,
  files,
}) => {
  const [subject, setSubject] = React.useState("")
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(files)

  React.useEffect(() => {
    setSelectedFiles(files)
  }, [files])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (messageFilter === "email") {
      await handleSendMessage(e, "email", subject, selectedFiles)
    } else if (messageFilter === "chat") {
      await handleSendMessage(e, "chat", undefined, selectedFiles)
    } else if (messageFilter === "sms") {
      await handleSendMessage(e, "sms")
    }
    setSubject("")
    setMessageText("")
    setFiles(null)
    setSelectedFiles(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files)
    setFiles(e.target.files)
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
