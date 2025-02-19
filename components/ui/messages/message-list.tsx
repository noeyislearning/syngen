"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { MessageTypeProps } from "@/lib/types"
import { useMail } from "@/hooks/use-mail"
import { Card, ScrollArea } from "@/components/shared/"

interface MessageListProps {
  items: MessageTypeProps[]
}

export function MessageList({ items }: MessageListProps) {
  const [mail, setMail] = useMail()
  const [sortedItems, setSortedItems] = React.useState<MessageTypeProps[]>([])

  React.useEffect(() => {
    if (!items || items.length === 0) {
      setSortedItems([])
      return
    }

    const sorted = [...items].sort((a, b) => {
      const latestMessageA = a.messages[0]?.date ? new Date(a.messages[0].date).getTime() : 0
      const latestMessageB = b.messages[0]?.date ? new Date(b.messages[0].date).getTime() : 0
      return latestMessageB - latestMessageA
    })

    setSortedItems(sorted)
  }, [items])

  if (!sortedItems || sortedItems.length === 0) {
    return (
      <ScrollArea className="h-full border-x p-2">
        <div>No messages.</div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="h-full border-x p-2">
      <div className="flex flex-col gap-2 pt-0">
        {sortedItems.map((sender) => {
          const latestMessage = sender.messages[0]
          return (
            <Card
              key={sender.userId}
              className={cn(
                "flex cursor-pointer flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all duration-300 ease-in-out hover:bg-accent",
                mail.selectedSender?.userId === sender.userId && "bg-muted",
              )}
              onClick={() =>
                setMail({
                  ...mail,
                  selectedSender: sender,
                  selectedMessageId: null,
                })
              }
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{sender.from}</div>
                  </div>
                </div>
                {latestMessage?.subject && (
                  <div className="text-xs font-medium">{latestMessage.subject}</div>
                )}
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {latestMessage?.text.substring(0, 300)}
              </div>
            </Card>
          )
        })}
      </div>
    </ScrollArea>
  )
}
