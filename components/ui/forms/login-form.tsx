"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { Button, Input, Label } from "@/components/shared/"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isSignUp, setIsSignUp] = React.useState(false)

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp)
  }

  const renderLoginForm = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold">Syngen.</h1>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Button type="button" onClick={handleToggleSignUp} variant="link">
            Sign up
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required name="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Password" required name="password" />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </div>
  )

  const renderSignUpForm = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold">Syngen.</h1>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Button type="button" onClick={handleToggleSignUp} variant="link">
            Login
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Username" required name="username" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required name="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Password" required name="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="passwordConfirm">Confirm Password</Label>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="Confirm Password"
            required
            name="passwordConfirm"
          />
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </div>
    </div>
  )

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>{isSignUp ? renderSignUpForm() : renderLoginForm()}</form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
