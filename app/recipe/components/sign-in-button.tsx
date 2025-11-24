"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignInButton() {
  return (
    <Button
      onClick={() =>
        signIn("discord", {
          callbackUrl: "/recipe",
        })
      }
    >
      Sign in with Discord
    </Button>
  )
}
