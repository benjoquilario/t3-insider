"use client"

import React from "react"
import { LINKS } from "./nav"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { BsPerson } from "react-icons/bs"
import { SignOut } from "./sign-out"
import { IoCreateOutline } from "react-icons/io5"
import usePostStore from "@/store/post"

const MobileNav = () => {
  const { data: session } = useSession()
  const setIsPostOpen = usePostStore(store => store.setIsPostOpen)

  return (
    <div className="fixed bottom-0 z-50 flex w-full bg-background md:hidden">
      <nav className="w-full" aria-label="mobile nav">
        <ul className="flex items-start">
          {LINKS.map((link) => (
            <li key={link.linkName} className="flex flex-1 items-start">
              <Link
                aria-label={link.linkName}
                href="/"
                className={cn(
                  "flex w-full items-center justify-center rounded-md p-2 focus:outline-none",
                  "focus-visible:outline-offset-2 focus-visible:outline-primary",
                  "transition duration-75 hover:bg-primary/40"
                )}
              >
                <link.icon
                  aria-hidden="true"
                  size={link.size}
                  className="text-primary"
                />
              </Link>
            </li>
          ))}
          <li className="flex flex-1 items-start">
            <Link
              aria-label="my profile"
              href={`/profile/${session?.user.id}`}
              className={cn(
                "flex w-full items-center justify-center rounded-md p-2 focus:outline-none",
                "focus-visible:outline-offset-2 focus-visible:outline-primary",
                "transition duration-75 hover:bg-primary/40"
              )}
            >
              <BsPerson size={29} className="text-primary" />
            </Link>
          </li>
          <li className="flex flex-1 items-start">
            <SignOut />
          </li>
          {/* <li className="mt-3 w-full flex-1">
            <div className="flex w-full items-center">
              <Button
                onClick={() => setIsPostOpen(true)}
                className="h-11 w-full rounded-3xl"
                size="lg"
              >
                Create Post
              </Button>
            </div>
          </li> */}
        </ul>
      </nav>

      <button onClick={() => setIsPostOpen(true)} className="absolute bottom-16 right-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
        <IoCreateOutline size={20} className="h-7 w-7" />
      </button>
    </div>
  )
}

export default MobileNav
