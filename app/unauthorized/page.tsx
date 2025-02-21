"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/shared/"

export default function UnauthorizedPage() {
  const router = useRouter()
  const handleGoBack = () => {
    router.push("/")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-1">
      <h2 className="text-xl font-semibold">You are not authorized to view this page.</h2>
      <p className="text-sm text-muted-foreground">Please log in to access your messages.</p>
      <div className="flex items-center gap-2 pt-4">
        <Button variant="outline" size="sm">
          <Link href={"https://github.com/noeyislearning/syngen/issues"} target="_blank">
            Contact support
          </Link>
        </Button>
        <Button onClick={handleGoBack} variant="default" size="sm">
          Go to login
        </Button>
      </div>
    </div>
  )
}
