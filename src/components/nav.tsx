"use client"

import React from "react"
import { BsPerson, BsPeople } from "react-icons/bs"
import { SlPeople } from "react-icons/sl"
import { BiHomeCircle } from "react-icons/bi"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { MdDynamicFeed } from "react-icons/md"
import { Button } from "./ui/button"
import usePostStore from "@/store/post"
import { useSession } from "next-auth/react"
import { useQueryUser } from "@/hooks/queries/useQueryUser"

export const LINKS = [
  {
    link: "/",
    icon: MdDynamicFeed,
    size: 29,
    linkName: "Feed",
  },
  {
    link: "/followers",
    icon: SlPeople,
    size: 29,
    linkName: "Followers",
  },
  {
    link: "/following",
    icon: BsPeople,
    size: 29,
    linkName: "Following",
  },
]
const Nav = () => {
  const setIsPostOpen = usePostStore((store) => store.setIsPostOpen)
  const { data: currentUser } = useQueryUser()

  return (
    <div className="mt-0">
      <nav className="w-full">
        <ul className="flex flex-col items-start space-y-2">
          {LINKS.map((link) => (
            <li key={link.linkName} className="flex flex-1 items-start">
              <Link
                aria-label={link.linkName}
                href="/"
                className={cn(
                  "flex w-full items-center space-x-3 rounded-md px-5 py-3 focus:outline-none",
                  "focus-visible:outline-offset-2 focus-visible:outline-primary",
                  "transition duration-75 hover:bg-primary/40"
                )}
              >
                <link.icon
                  aria-hidden="true"
                  size={link.size}
                  className="text-primary"
                />
                <span className="text-left text-base font-medium capitalize tracking-tight">
                  {link.linkName}
                </span>
              </Link>
            </li>
          ))}
          <li className="flex flex-1 items-start">
            <Link
              aria-label="my profile"
              href={`/profile/${currentUser?.id}`}
              className={cn(
                "flex w-full items-center space-x-3 rounded-md px-5 py-3 focus:outline-none",
                "focus-visible:outline-offset-2 focus-visible:outline-primary",
                "transition duration-75 hover:bg-primary/40"
              )}
            >
              <BsPerson size={29} className="text-primary" />
              <span className="text-left text-base font-medium capitalize tracking-tight">
                My Profile
              </span>
            </Link>
          </li>
          <li className="mt-3 w-full flex-1">
            <div className="flex w-full items-center">
              <Button
                onClick={() => setIsPostOpen(true)}
                className="h-11 w-full rounded-3xl"
                size="lg"
              >
                Create Post
              </Button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav
