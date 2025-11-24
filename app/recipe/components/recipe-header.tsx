"use client"

import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RecipeHeaderProps {
  session: Session
}

export function RecipeHeader({ session }: RecipeHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold">Recipe</h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300" />
          )}
          <span className="font-medium hidden md:inline">{session.user?.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>{session.user?.name}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
