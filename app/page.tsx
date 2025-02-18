import { LoginForm } from "@/components/ui/forms/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-inherit p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <LoginForm />
      </div>
    </div>
  )
}
