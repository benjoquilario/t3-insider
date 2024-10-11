"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BsFillPersonPlusFill } from "react-icons/bs"
import type { User } from "@prisma/client"

type UserItemProps = {
  user: User
}

const UserItem = (props: UserItemProps) => {
  const { user } = props

  return (
    <li className="relative h-16 overflow-hidden rounded-md hover:bg-secondary">
      <Link
        href={`/profile/${user.id}`}
        className="outline-offset-2 transition duration-75 hover:bg-secondary focus:outline-none focus:ring focus:ring-offset-2 active:bg-[#5544c8]"
      >
        <div className="absolute inset-0 flex items-center overflow-hidden rounded-md border border-secondary">
          <div className="ml-3">
            <Avatar>
              <AvatarImage src={user.image ?? ""} alt="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-4 flex-1 text-foreground">
            <h3 className="text-sm font-semibold capitalize leading-tight">
              {user.name}
            </h3>
            <p className="text-xs">21 Followers</p>
          </div>
        </div>
      </Link>
      {/* {profile.followers?.some((follower) => follower === user?.result?._id) ? (
        <div className="absolute top-4 right-0 ml-auto mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-[#6a55fa] text-white">
          <BsFillCheckCircleFill aria-hidden="true" size={15} />
        </div>
      ) : ( */}
      <div className="absolute right-0 top-4">
        <button
          aria-label="follow user"
          className={cn(
            "ml-auto mr-3 flex size-8 items-center justify-center rounded-md"
          )}
        >
          <BsFillPersonPlusFill aria-hidden="true" size={15} />
        </button>
      </div>
    </li>
  )
}

export default UserItem
