"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { AuthFormProps } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { registerSchema, RegisterSchemaType } from "@/schemas/register-schema"

import {
  Button,
  Input,
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/"

export const RegisterForm: React.FC<AuthFormProps> = ({ handleToggleSignUp }) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setErrors] = React.useState<Record<string, string> | null>(null)
  const router = useRouter()

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    mode: "onSubmit",
  })

  const handleSubmit = async (values: RegisterSchemaType) => {
    setErrors(null)
    setLoading(true)

    const payload = { email: values.email, password: values.password }

    try {
      await apiClient("/user/register", "POST", payload)

      router.push("/")
    } catch (err: unknown) {
      console.error("Registration Failed", err)
      if (err instanceof Error && err.message.includes("Errors:")) {
        try {
          const errorsStartIndex = err.message.indexOf("Errors:") + "Errors:".length
          const errorsJsonString = err.message.substring(errorsStartIndex).trim()
          const backendErrors = JSON.parse(errorsJsonString)
          setErrors(backendErrors)
        } catch (parseError) {
          console.error("Failed to parse backend errors", parseError)
          setErrors({ form: err.message || "Registration failed. Please try again." })
        }
      } else if (err instanceof Error) {
        setErrors({ form: err.message || "Registration failed. Please try again." })
      } else {
        setErrors({ form: "Registration failed. An unexpected error occurred." }) // Handle cases where err is not an Error object
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
            Already have an account?{" "}
            <Button type="button" onClick={handleToggleSignUp} variant="link">
              Login
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
        <FormItem>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder="Confirm Password"
              {...form.register("passwordConfirm")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {error?.form && <p className="text-center text-sm text-red-500">{error.form}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          Register
        </Button>
      </form>
    </Form>
  )
}
