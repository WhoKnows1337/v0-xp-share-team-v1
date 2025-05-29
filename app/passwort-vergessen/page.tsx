import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Passwort vergessen | XP Share",
  description: "Setze dein Passwort zurück, um wieder Zugang zu deinem XP Share Konto zu erhalten",
}

export default function ForgotPasswordPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
