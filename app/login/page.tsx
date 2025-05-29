import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Anmelden | XP Share",
  description: "Melde dich bei XP Share an, um deine Erlebnisse zu teilen und zu entdecken",
}

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
