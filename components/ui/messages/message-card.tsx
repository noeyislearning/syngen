"use client"

import * as React from "react"
import { MailIcon, MessageSquareIcon, PhoneIcon } from "lucide-react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/shared/"
import { MessageTypeProps } from "@/lib/types"

interface MessageCardProps {
  filteredMessages: MessageTypeProps["messages"]
  messageFilter: string
  formatDateDisplay: (dateString: string | undefined) => string
  selectedEmailMessage: MessageTypeProps["messages"][number] | null
  setSelectedEmailMessage: React.Dispatch<
    React.SetStateAction<MessageTypeProps["messages"][number] | null>
  >
  message: MessageTypeProps | null
}

export const MessageCard: React.FC<MessageCardProps> = ({
  filteredMessages,
  messageFilter,
  formatDateDisplay,
  selectedEmailMessage,
  setSelectedEmailMessage,
  message,
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [filteredMessages])

  return (
    <div className="mt-6 flex flex-col gap-4 overflow-auto">
      {filteredMessages.map((msg, index) => (
        <div key={index}>
          {msg.messageType === "email" && messageFilter === "email" ? (
            <div
              className={`relative flex ${msg.isSender ? "ml-auto justify-end" : "justify-start"}`}
            >
              <Dialog
                open={selectedEmailMessage?.id === msg.id}
                onOpenChange={(open) =>
                  open
                    ? setSelectedEmailMessage(msg as MessageTypeProps["messages"][number] | null)
                    : setSelectedEmailMessage(null)
                }
              >
                <div className="flex w-fit max-w-fit flex-row items-start gap-1">
                  <DialogTrigger asChild>
                    <div className="w-full cursor-pointer whitespace-pre-wrap border border-muted p-3 text-sm">
                      {msg.isSender ? (
                        <div className="flex flex-row items-center justify-end gap-2">
                          <p className="font-bold">{msg.subject}</p>
                        </div>
                      ) : (
                        <div className="flex flex-row items-center justify-start gap-2">
                          <p className="font-bold">{msg.subject}</p>
                        </div>
                      )}
                      {msg.isSender ? (
                        <div className="flex flex-row items-center justify-end gap-2">
                          <p className="line-clamp-2">{msg.text.substring(0, 300)}</p>
                        </div>
                      ) : (
                        <div className="flex flex-row items-center justify-start gap-2">
                          <p className="line-clamp-2">{msg.text.substring(0, 300)}</p>
                        </div>
                      )}

                      {msg.isSender ? (
                        <div className="flex flex-row items-center justify-end gap-2 text-end text-xs text-muted-foreground">
                          {formatDateDisplay(msg.date)}
                          <MailIcon className="h-4 w-4 text-blue-600" />
                        </div>
                      ) : (
                        <span className="flex flex-row items-center justify-start gap-2 text-end text-xs text-muted-foreground">
                          <MailIcon className="h-4 w-4 text-blue-600" />
                          {formatDateDisplay(msg.date)}
                        </span>
                      )}
                      {/* Display Attachments for Email Preview */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2">
                          <h4 className="mb-1 text-xs font-semibold">Attachments:</h4>
                          <ul className="list-disc pl-5">
                            {msg.attachments.map((attachment, index) => (
                              <li key={index} className="text-xs text-blue-500 hover:underline">
                                <a
                                  href={attachment.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {attachment.filename}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                </div>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{msg.subject}</DialogTitle>
                    <DialogDescription>
                      {msg.isSender ? `To: ${message?.from}` : `From: ${message?.from}`}
                      <br />
                      Date: {formatDateDisplay(msg.date)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="whitespace-pre-wrap py-4">{msg.text}</div>
                  {/* Display Attachments in Full Email Dialog */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-1 text-sm font-semibold">Attachments:</h4>
                      <ul className="list-disc pl-5">
                        {msg.attachments.map((attachment, index) => (
                          <li key={index} className="text-sm text-blue-500 hover:underline">
                            <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                              {attachment.filename}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <DialogFooter>
                    <Button>Reply</Button>
                    <Button variant="outline" onClick={() => setSelectedEmailMessage(null)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : msg.messageType === "chat" && messageFilter === "chat" ? (
            <div
              key={msg.id}
              className={`flex w-fit max-w-fit ${
                msg.isSender ? "ml-auto justify-end" : "justify-start"
              }`}
            >
              <div className="flex max-w-xs flex-col gap-1 rounded-md bg-muted p-3">
                {msg.isSender ? (
                  <div className="flex items-center justify-end gap-2">
                    <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                  </div>
                )}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2">
                    <h4 className="mb-1 text-xs font-semibold">Attachments:</h4>
                    <ul className="list-disc pl-5">
                      {msg.attachments.map((attachment, index) => (
                        <li key={index} className="text-xs text-blue-500 hover:underline">
                          <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                            {attachment.filename}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {msg.isSender ? (
                  <div className="flex items-center justify-end gap-2 text-end text-xs text-muted-foreground">
                    {formatDateDisplay(msg.date)}
                    <MessageSquareIcon className="h-4 w-4 text-emerald-600" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquareIcon className="h-4 w-4 text-emerald-600" />
                    {formatDateDisplay(msg.date)}
                  </div>
                )}
              </div>
            </div>
          ) : msg.messageType === "sms" && messageFilter === "sms" ? (
            <div
              key={msg.id}
              className={`flex w-fit max-w-fit ${
                msg.isSender ? "ml-auto justify-end" : "justify-start"
              }`}
            >
              <div className="flex max-w-xs flex-col gap-1 rounded-md bg-muted p-3">
                {msg.isSender ? (
                  <div className="flex items-center justify-end gap-2">
                    <p className="line-clamp-2 whitespace-pre-wrap text-sm">{msg.text}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="line-clamp-2 whitespace-pre-wrap text-sm">{msg.text}</p>
                  </div>
                )}
                {msg.isSender ? (
                  <div className="flex items-center justify-end gap-2 text-end text-xs text-muted-foreground">
                    {formatDateDisplay(msg.date)}
                    <PhoneIcon className="h-4 w-4 text-orange-500" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <PhoneIcon className="h-4 w-4 text-orange-500" />
                    {formatDateDisplay(msg.date)}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
