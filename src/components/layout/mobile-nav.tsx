import React from "react"
import classNames from "classnames"
import { useRouter } from "next/router"
import type { User as UserType } from "@/types/types"
import { useSession } from "next-auth/react"
import Button from "@/components/shared/button"
import { BiBookmark, BiHomeCircle } from "react-icons/bi"
import { BsBell, BsPerson } from "react-icons/bs"

type MobileNav = {
  auth: UserType
}

const LIST = [
  {
    href: "/bookmarks",
    icon: BiBookmark,

    linkName: "Bookmark",
  },
  {
    href: "/notification",
    icon: BsBell,

    linkName: "Notification",
  },
  {
    href: "/profile",
    icon: BsPerson,

    linkName: "Profile",
  },
]
const MobileNav: React.FC = () => {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 rounded-t-3xl bg-zinc-50 px-3 py-1 shadow-md ring ring-zinc-100 md:hidden">
      <ul className="flex items-center justify-around gap-3 text-white">
        <li className="">
          <Button
            className={classNames(
              router.asPath === "/"
                ? "bg-[#cec9ef] text-primary"
                : "text-zinc-900",
              "flex h-10 w-16 flex-col items-center justify-center rounded-full p-1 hover:bg-zinc-200 active:scale-105"
            )}
            onClick={() => router.push("/")}
            aria-label="Home"
          >
            <BiHomeCircle aria-hidden="true" size={24} className="m-0 " />
          </Button>
        </li>
        {LIST.map((link) => (
          <li key={link.linkName} className="">
            <Button
              className={classNames(
                router.pathname.includes(link.href)
                  ? "bg-[#cec9ef] text-primary"
                  : "text-zinc-900",
                "flex h-10 w-16 flex-col items-center justify-center rounded-full p-1 hover:bg-zinc-200 active:scale-105"
              )}
              onClick={() =>
                router.push(
                  `${link.href}${
                    link.href.includes("profile")
                      ? `/${session?.user?.id || ""}`
                      : ""
                  }`
                )
              }
              aria-label={link.linkName}
            >
              <link.icon aria-hidden="true" size={24} className="m-0 " />
              {/* <span className="text-center text-xs font-semibold md:block">
                {link.linkName}
              </span> */}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MobileNav
