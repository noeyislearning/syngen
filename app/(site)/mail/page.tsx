"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useUser } from "@/hooks/use-user"
import { Mail } from "@/components/ui/mail/mail"
import { accounts, mails } from "@/data/mails"

export default function MailPage() {
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
      <Mail accounts={accounts} mails={mails} navCollapsedSize={4} />
    </div>
  )
}
