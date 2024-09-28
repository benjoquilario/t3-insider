"use client"

import React from "react"
import { BsPerson, BsPeople } from "react-icons/bs"
import { SlPeople } from "react-icons/sl"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { MdDynamicFeed } from "react-icons/md"
import { Button } from "./ui/button"
import usePostStore from "@/store/post"
import { usePathname, useSelectedLayoutSegment } from "next/navigation"
import { MdOutlinePersonSearch } from "react-icons/md"
import { IoMdNotificationsOutline } from "react-icons/io"
import { type User } from "@prisma/client"
import { useSession } from "next-auth/react"

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

type NavProps = {
  currentUser: User
}

const Nav: React.FC<NavProps> = ({ currentUser }: NavProps) => {
  const setIsPostOpen = usePostStore((store) => store.setIsPostOpen)
  const { data: session } = useSession()

  const segment = useSelectedLayoutSegment()
  const pathname = usePathname()

  const className = cn(
    "flex w-full items-center space-x-3 rounded-md px-5 py-3 focus:outline-none",
    "focus-visible:outline-offset-2 focus-visible:outline-primary",
    "transition duration-75 hover:bg-primary/40"
  )

  return (
    <div className="mt-0">
      <nav className="w-full">
        <ul className="flex flex-col items-start space-y-2">
          <li className="flex flex-1 items-start">
            <Link aria-label="feed" href="/" className={className}>
              <MdDynamicFeed
                aria-hidden="true"
                size={29}
                className="text-primary"
              />
              <span className="text-left text-base font-medium capitalize tracking-tight">
                Feed
              </span>
            </Link>
          </li>
          <li className="flex flex-1 items-start">
            <Link
              aria-label="feed"
              href={`/discover`}
              className={cn(className)}
            >
              <MdOutlinePersonSearch
                aria-hidden="true"
                size={29}
                className="text-primary"
              />
              <span className="text-left text-base font-medium capitalize tracking-tight">
                Discover
              </span>
            </Link>
          </li>
          <li className="flex flex-1 items-start">
            <Link aria-label="feed" href={`/nofications`} className={className}>
              <IoMdNotificationsOutline
                aria-hidden="true"
                size={29}
                className="text-primary"
              />
              <span className="text-left text-base font-medium capitalize tracking-tight">
                Notification
              </span>
            </Link>
          </li>

          <li className="flex flex-1 items-start">
            <Link
              aria-label="my profile"
              href={`/profile/${currentUser?.id ?? session?.user.id ?? ""}`}
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
