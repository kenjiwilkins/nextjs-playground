"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function SignOutButton({ variant = "secondary" }: SignOutButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={() =>
        signOut({
          callbackUrl: "/recipe",
        })
      }
      className="w-full"
    >
      Sign out from Discord
    </Button>
  )
}
