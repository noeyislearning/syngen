"use client"

import * as React from "react"

import { AuthFormProps } from "@/lib/types"

import { Button, Input, Label } from "@/components/shared/"

export const LoginForm: React.FC<AuthFormProps> = ({ handleToggleSignUp, loading }) => (
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
      <Button type="submit" className="w-full" disabled={loading}>
        {" "}
        {/* Optional loading prop */}
        Login
      </Button>
    </div>
  </div>
)
