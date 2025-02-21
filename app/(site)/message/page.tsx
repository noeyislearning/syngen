"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useUser } from "@/hooks/use-user"
import { apiClient } from "@/lib/api"
import { MessageTypeProps } from "@/lib/types"

import { Card } from "@/components/shared/"
import { Message } from "@/components/ui/messages/message"

export default function MessagePage() {
  const { user, isLoading, isLoggingOut } = useUser()
  const router = useRouter()
  const [messages, setMessages] = React.useState<MessageTypeProps[]>([])
  const [fetchLoading, setFetchLoading] = React.useState(false)
  const [fetchError, setFetchError] = React.useState<string | null>(null)
  const [lastMessagesModified, setLastMessagesModified] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isLoading) {
      return
    }

    if (!user && !isLoggingOut) {
      router.push("/unauthorized")
      return
    }

    const fetchMessages = async () => {
      if (user?.userId) {
        setFetchLoading(true)
        setFetchError(null)

        const headers: HeadersInit = {}
        if (lastMessagesModified) {
          headers["If-Modified-Since"] = lastMessagesModified
        }

        try {
          const response = (await apiClient(
            "/message/messages",
            "GET",
            undefined,
            headers,
          )) as Response

          if (response && response.status === 304) {
            console.log("Messages not modified since last fetch. Using cached data.")
            setFetchLoading(false)
            return
          }

          if (response) {
            const fetchedMessages = (await response.json()) as MessageTypeProps[]
            setMessages(fetchedMessages)

            const lastModified = response.headers.get("Last-Modified")
            if (lastModified) {
              setLastMessagesModified(lastModified)
            }
          }
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
  }, [user, isLoading, router, isLoggingOut, lastMessagesModified])

  if (isLoading) {
    return null
  }

  return (
    <div className="flex h-screen w-full">
      {fetchError ? (
        <div className="flex min-h-svh w-full flex-col items-center justify-center gap-2 text-sm">
          <span>Error fetching messages.</span>
          <Card className="p-4 font-mono text-red-500">{fetchError}</Card>
        </div>
      ) : fetchLoading ? (
        <div className="flex min-h-svh items-center justify-center"></div>
      ) : (
        <Message messages={messages} navCollapsedSize={4} />
      )}
    </div>
  )
}
