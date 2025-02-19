"use client"

import { format } from "date-fns/format"
import * as React from "react"
import { MailIcon, PhoneCall, MessageSquareIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
} from "@/components/shared/"
import { MessageTypeProps } from "@/lib/types"

interface MessageDisplayProps {
  message: MessageTypeProps | null
}

type SelectedEmailMessageType = MessageTypeProps["messages"][number] | null

export function MessageDisplay({ message }: MessageDisplayProps) {
  const [selectedEmailMessage, setSelectedEmailMessage] =
    React.useState<SelectedEmailMessageType>(null)

  if (!message) {
    return <div className="p-8 text-center text-muted-foreground">No sender selected</div>
  }

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
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex items-start gap-4 text-sm">
          <Avatar>
            <AvatarImage alt={message.from} />
            <AvatarFallback>
              {message.from
                .split(" ")
                .map((chunk) => chunk[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="grid">
            <div className="font-semibold">{message.from}</div>
            <div className="text-muted-foreground">{message.phoneNumber}</div>
          </div>
        </div>
        <Separator />
        <div className="mt-4 flex flex-col gap-4">
          {message.messages
            .slice()
            .reverse()
            .map((msg) => (
              <React.Fragment key={msg.id}>
                {msg.messageType === "email" ? (
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
                            <div className="flex flex-row items-center gap-2">
                              <MailIcon className="h-4 w-4 text-blue-600" />
                              <p className="font-bold">Subject: {msg.subject}</p>
                            </div>
                            <p className="line-clamp-2">{msg.text.substring(0, 300)}</p>
                            <span className="text-xs text-muted-foreground">
                              {msg.date ? format(new Date(msg.date), "PPpp") : "N/A"}
                            </span>
                          </div>
                        </DialogTrigger>
                      </div>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{msg.subject}</DialogTitle>
                          <DialogDescription>
                            From: {message.from}
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
                ) : msg.messageType === "chat" ? (
                  <div
                    key={msg.id}
                    className={`flex w-fit max-w-fit ${
                      msg.isSender ? "ml-auto justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex flex-col gap-1 rounded-md bg-muted p-3">
                      <div className="flex items-center gap-1">
                        <MessageSquareIcon className="h-4 w-4 text-emerald-600" />
                        <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {msg.date ? format(new Date(msg.date), "PPpp") : "N/A"}
                      </div>
                    </div>
                  </div>
                ) : null}
              </React.Fragment>
            ))}
        </div>
      </div>
      <Separator className="mt-auto" />
      <div className="p-4">
        <form>
          <div className="grid gap-4">
            <Textarea className="p-4" placeholder={`Reply ${message.from}...`} />
            <div className="flex items-center">
              <Button onClick={(e) => e.preventDefault()} size="sm" className="ml-auto">
                Reply
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
