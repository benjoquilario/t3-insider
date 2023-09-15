import React from "react"
import Image from "@/components/shared/image"
import Link from "next/link"
import { BsFillPersonPlusFill } from "react-icons/bs"
import classNames from "classnames"
import type { User as UserType } from "@/types/types"

type UserProps = {
  user: UserType
}

const User: React.FC<UserProps> = ({ user }) => {
  return (
    <li className="relative h-16 overflow-hidden rounded-md hover:bg-[#fafafa]">
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
      {/* {profile.followers?.some((follower) => follower === user?.result?._id) ? (
        <div className="absolute top-4 right-0 ml-auto mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-[#6a55fa] text-white">
          <BsFillCheckCircleFill aria-hidden="true" size={15} />
        </div>
      ) : ( */}
      <div className="absolute right-0 top-4">
        <button
          aria-label="follow user"
          className={classNames(
            user?.coverPhoto
              ? "bg-primary text-white"
              : "bg-white text-primary",
            "ml-auto mr-3 flex h-8 w-8 items-center justify-center rounded-md"
          )}
        >
          <BsFillPersonPlusFill aria-hidden="true" size={15} />
        </button>
      </div>
    </li>
  )
}

export default User
