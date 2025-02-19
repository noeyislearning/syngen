"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useUser } from "@/hooks/use-user"
import { Message } from "@/components/ui/messages/message"
import { apiClient } from "@/lib/api"
import { MessageTypeProps } from "@/lib/types"

export default function MessagePage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [messages, setMessages] = React.useState<MessageTypeProps[]>([])
  const [fetchLoading, setFetchLoading] = React.useState(false)
  const [fetchError, setFetchError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!user && !isLoading) {
      router.push("/")
    }
  }, [user, isLoading, router])

  React.useEffect(() => {
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

    if (user) {
      fetchMessages()
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div>Loading session...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen w-full">
      {fetchError && (
        <div className="absolute left-2 top-2 rounded bg-red-500 p-2 text-white">
          Error fetching messages: {fetchError}
        </div>
      )}
      {fetchLoading ? (
        <div className="flex min-h-svh items-center justify-center">
          <div>Loading messages...</div>
        </div>
      ) : (
        <Message messages={messages} navCollapsedSize={4} />
      )}
    </div>
  )
}
