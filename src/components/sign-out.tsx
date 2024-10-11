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
            "flex w-full items-center justify-center rounded-md p-2 focus:outline-none md:w-auto md:justify-start md:space-x-3 md:px-5 md:py-3",
            "focus-visible:outline-offset-2 focus-visible:outline-primary",
            "transition duration-75 hover:bg-primary/40"
          )}
        >
          <RiLogoutCircleRLine size={29} className="text-primary" />
          <span className="hidden text-left text-base font-medium capitalize tracking-tight md:block">
            Logout
          </span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Do you really wish to logout?
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
