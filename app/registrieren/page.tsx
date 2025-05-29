import { RegisterForm } from "@/components/auth/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registrieren | XP Share",
  description: "Erstelle ein neues Konto bei XP Share, um deine Erlebnisse zu teilen und zu entdecken",
}

export default function RegisterPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
