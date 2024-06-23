"use client"

import { RiLogoutCircleRLine } from "react-icons/ri"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

export function SignOut() {
  return (
    <button
      className={cn(
        "flex items-center space-x-3 rounded-md px-5 py-3 focus:outline-none",
        "focus-visible:outline-offset-2 focus-visible:outline-primary",
        "transition duration-75 hover:bg-primary/40"
      )}
      onClick={() => signOut()}
    >
      <RiLogoutCircleRLine size={29} className="text-primary" />
      <span className="text-left text-base font-medium capitalize tracking-tight">
        Logout
      </span>
    </button>
  )
}
