"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useUser } from "@/hooks/use-user"
import { apiClient } from "@/lib/api"
import { MessageTypeProps } from "@/lib/types"

import { Card } from "@/components/shared/"
import { Message } from "@/components/ui/messages/message"
import { Unauthorized } from "@/components/ui/unathorized"

export default function MessagePage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [messages, setMessages] = React.useState<MessageTypeProps[]>([])
  const [fetchLoading, setFetchLoading] = React.useState(false)
  const [fetchError, setFetchError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isLoading || !user) {
      return
    }

    const fetchMessages = async () => {
      if (user?.userId) {
        setFetchLoading(true)
        setFetchError(null)
        try {
          const fetchedMessages = await apiClient("/message/messages", "GET")
          setMessages(fetchedMessages as MessageTypeProps[])
        } catch (error) {
          if (error instanceof Error) {
            setFetchError(error.message || "Failed to fetch messages.")
          } else {
            setFetchError("Failed to fetch messages.")
          }
        } finally {
          setFetchLoading(false)
        }
      }
    }

    fetchMessages()
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <Unauthorized />
  }

  return (
    <div className="flex h-screen w-full">
      {fetchError && (
        <div className="flex min-h-svh flex-col items-center justify-center">
          <span>Error fetching messages.</span>
          <Card>{fetchError}</Card>
        </div>
      )}
      {fetchLoading ? (
        <div className="flex min-h-svh items-center justify-center">Loading messages...</div>
      ) : (
        <Message messages={messages} navCollapsedSize={4} />
      )}
    </div>
  )
}
