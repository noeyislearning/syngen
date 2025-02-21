"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { AuthFormProps, UserProps } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { useUser } from "@/hooks/use-user"
import { loginSchema, LoginSchemaType } from "@/schemas/login-schema"

import {
  Button,
  Input,
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/"

export const LoginForm: React.FC<AuthFormProps> = ({ handleToggleSignUp }) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const { login } = useUser()

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })

  const handleSubmit = async (values: LoginSchemaType) => {
    setError(null)
    setLoading(true)

    try {
      const response = await apiClient("/auth/login", "POST", values)
      localStorage.setItem("accessToken", response.tokens.access)
      localStorage.setItem("refreshToken", response.tokens.refresh)
      const userData: UserProps = { userId: response.userId, email: values.email, phoneNumber: "" }
      login(userData)
      router.push("/message")
    } catch (error) {
      if (error instanceof Error) {
        setError((error as Error).message || "Login failed. Please check your credentials.")
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">Syngen.</h1>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Button type="button" onClick={handleToggleSignUp} variant="link">
              Register
            </Button>
          </div>
        </div>
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="m@example.com" {...form.register("email")} />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="Password" {...form.register("password")} />
          </FormControl>
          <FormMessage />
        </FormItem>
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          Login
        </Button>
      </form>
    </Form>
  )
}
