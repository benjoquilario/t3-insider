import Link from "next/link"
import Image from "./image"
import type { User as UserType } from "@/types/types"
import React from "react"

type UserProps = {
  user: UserType
}

const FollowerItem: React.FC<UserProps> = ({ user }) => {
  return (
    <div className="relative h-16 w-full overflow-hidden rounded-md hover:bg-[#fafafa]">
      <Link
        href={`/profile/${user?.id || ""}`}
        aria-label={user?.name}
        className="outline-offset-2 transition duration-75 focus:outline-none focus:ring focus:ring-offset-2 hover:bg-secondary active:bg-[#5544c8]"
      >
        <div className="absolute inset-0 flex items-center overflow-hidden rounded-md border border-zinc-200">
          <div className="ml-3">
            <Image
              className="rounded-full"
              src={user?.image || "/default-image.png"}
              alt={user?.name}
              layout="fill"
              containerclassnames="relative h-12 w-12 rounded-md"
            />
          </div>
          <div className="ml-4 flex-1 text-black">
            <h3 className="text-sm font-semibold capitalize leading-tight">
              {user?.name}
            </h3>
            <p className="text-xs">21 Followers</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default FollowerItem
