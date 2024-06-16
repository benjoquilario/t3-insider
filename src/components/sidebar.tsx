"use client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegCircle } from "react-icons/fa"
import React from "react"
import Nav from "./nav"

const SideBar = () => {
  return (
    <div className="sticky top-0">
      <Link
        href="/"
        className="focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
      >
        <div className="flex h-14 w-full items-center justify-start gap-2 px-5 text-2xl font-light">
          <span className="text-primary">
            <FaRegCircle />
          </span>
          <span className="text-3xl font-bold uppercase text-primary">
            Insider
          </span>
        </div>
      </Link>
      <div className="rounded px-4 py-5">
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-1">
            <div>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <h3 className="font-medium">Benjo Quilario</h3>
              <span className="text-xs text-muted-foreground/60">
                21 Followers
              </span>
            </div>
          </Link>
        </div>
      </div>
      <Nav />
    </div>
  )
}

export default SideBar
