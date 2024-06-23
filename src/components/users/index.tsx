"use client"

import React, { useState } from "react"
import { IoMdArrowDropdown } from "react-icons/io"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import UserItem from "./user-item"
import { cn } from "@/lib/utils"

const Users = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropDown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="sticky top-0 pt-3">
      <div className="relative flex items-center justify-end gap-2">
        <div className="flex items-center justify-end">
          <div className="flex items-center justify-center gap-1">
            {/* {isLoading ? (
              <div className="h-12 w-12 animate-pulse rounded-full border border-zinc-200 bg-zinc-100" />
            ) : ( */}
            <Button
              variant="secondary"
              onClick={toggleDropDown}
              className="w-18 flex h-14 items-center justify-center rounded-full hover:opacity-90 active:scale-95"
              aria-label="dropdown profile"
            >
              <div
                className={cn(
                  "transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              >
                <IoMdArrowDropdown aria-hidden="true" size={20} />
              </div>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
            {/* )}
            {isOpen && <Dropdown />} */}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <aside className="rounded-md shadow">
          <h2 className="px-5 py-3 text-sm font-semibold">Trends this week</h2>
          <a className="block" href="/tag/trpc">
            <div className="cursor-pointer px-5 py-3 hover:bg-secondary">
              <p className="text-md mb-2 font-bold">#trpc</p>
              <p className="text-xs font-medium text-muted-foreground/80">
                1 posts
              </p>
            </div>
          </a>
        </aside>
        <aside className="mt-2">
          <div className="flex w-full flex-col justify-center rounded-xl border border-t py-3">
            <p className="text-md text-center font-bold text-zinc-800">
              Who to follow
            </p>

            <ul className="mt-3 max-h-72 w-full space-y-1 overflow-y-auto">
              {/* {isUsersLoading
                ? Array.from(Array(4), (_, i) => <UsersSkeleton key={i} />)
                : data?.pages.map((page) =>
                    page.users.map((user) => (
                      <User user={user as UserType} key={user.id} />
                    ))
                  )}
              {hasNextPage && !isFetchingNextPage && (
                <li className="flex items-center justify-center">
                  <Button
                    type="button"
                    onClick={() => fetchNextPage()}
                    className="text-zinc-900"
                  >
                    Load More
                  </Button>
                </li>
              )} */}
              {}
              <UserItem />
              <UserItem />
              <UserItem />
              <UserItem />
              <UserItem />
              <UserItem />
              <UserItem />
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Users
