"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { LoginForm } from "@/components/ui/forms/login-form"
import { SignUpForm } from "@/components/ui/forms/signup-form"

export function AuthForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isSignUp, setIsSignUp] = React.useState(false)

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        {isSignUp ? (
          <SignUpForm handleToggleSignUp={handleToggleSignUp} />
        ) : (
          <LoginForm handleToggleSignUp={handleToggleSignUp} />
        )}
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        You agree to our <Link href="">Terms of Service</Link> and{" "}
        <Link href="">Privacy Policy</Link>.
      </div>
    </div>
  )
}
