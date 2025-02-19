"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { MailIcon, MessageSquareIcon } from "lucide-react" // Import icons

import { cn } from "@/lib/utils"
import { Card, ScrollArea } from "@/components/shared/"
import { type MessageType } from "@/data/messages"
import { useMail } from "@/hooks/use-mail"

interface MessageListProps {
  items: MessageType[]
  userId: string | undefined
}

export function MessageList({ items, userId }: MessageListProps) {
  const [mail, setMail] = useMail()

  const userMessages = React.useMemo(() => {
    return items.find((user) => user.userId === userId)
  }, [items, userId])

  const flattenedMessages = React.useMemo(() => {
    if (userMessages) {
      return userMessages.messages
    }
    return []
  }, [userMessages])

  if (!userMessages) {
    return (
      <ScrollArea className="h-full border-x p-2">
        <div>No messages for this user.</div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="h-full border-x p-2">
      <div className="flex flex-col gap-2 pt-0">
        {flattenedMessages.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "flex cursor-pointer flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted",
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {item.messageType === "email" ? ( // Render MailIcon for emails
                    <MailIcon className="h-4 w-4 text-blue-600" />
                  ) : item.messageType === "chat" ? ( // Render MessageSquareIcon for chats
                    <MessageSquareIcon className="h-4 w-4 text-emerald-600" />
                  ) : null}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    mail.selected === item.id ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              {item.subject && ( // Conditionally render subject if it exists
                <div className="text-xs font-medium">{item.subject}</div>
              )}
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.text.substring(0, 300)}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
