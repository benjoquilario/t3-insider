"use client"

import { RiLogoutCircleRLine } from "react-icons/ri"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"

export function SignOut() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className={cn(
            "flex items-center space-x-3 rounded-md px-5 py-3 focus:outline-none",
            "focus-visible:outline-offset-2 focus-visible:outline-primary",
            "transition duration-75 hover:bg-primary/40"
          )}
        >
          <RiLogoutCircleRLine size={29} className="text-primary" />
          <span className="text-left text-base font-medium capitalize tracking-tight">
            Logout
          </span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={() => signOut()}>Confirm</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
