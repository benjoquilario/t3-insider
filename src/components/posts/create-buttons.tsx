"use client"

import React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import usePostStore from "@/store/post"
import CreatePost from "./create-post"

const CreateButton = () => {
  const setIsPostOpen = usePostStore((store) => store.setIsPostOpen)

  return (
    <React.Fragment>
      <div className="relative my-2 flex h-20 items-center justify-start gap-2 overflow-hidden rounded p-2 shadow">
        <div className="min-h-6 w-12 max-w-20">
          <Link
            href={`/`}
            className="rounded-full ring-primary ring-offset-1 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary active:ring"
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <Button
          onClick={() => setIsPostOpen(true)}
          variant="secondary"
          className={cn(
            "mr-1 flex h-11 w-full items-center justify-start rounded-full",
            "ring-secondary-50 p-3 text-muted-foreground/80 focus:outline-none",
            "hover:bg-secondary-20 hover:text-foreground-50 hover:ring-secondary/60 active:bg-secondary/30",
            "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary active:text-foreground/60"
          )}
          aria-label="create a post"
        >
          <span className="ml-2 text-xs md:text-sm">
            What&apos;s on your mind,
          </span>
        </Button>
      </div>
      <CreatePost />
    </React.Fragment>
  )
}

export default CreateButton
