"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useUser } from "@/hooks/use-user"
import { Message } from "@/components/ui/messages/message"
import { messages } from "@/data/messages"

export default function MessagePage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (!user && !isLoading) {
      router.push("/")
    }
  }, [user, isLoading, router])

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
      <Message messages={messages} navCollapsedSize={4} />
    </div>
  )
}
