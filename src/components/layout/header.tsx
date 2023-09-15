import Link from "next/link"
import Image from "next/legacy/image"
import { BsPerson, BsPeople } from "react-icons/bs"
import { SlPeople } from "react-icons/sl"
import { BiHomeCircle } from "react-icons/bi"
import classNames from "classnames"
import Button from "@/components/shared/button"
import React from "react"
import UserSkeleton from "../skeleton/user-skeleton"
import usePostStore from "@/store/post"
import type { User as UserType } from "@/types/types"
import { FaEdit } from "react-icons/fa"
import { useRouter } from "next/router"
import { TbCircles } from "react-icons/tb"

export const LINKS = [
  {
    href: "/followers",
    icon: SlPeople,
    size: 29,
    linkName: "Followers",
  },
  {
    href: "/following",
    icon: BsPeople,
    size: 29,
    linkName: "Following",
  },
  {
    href: "/profile",
    icon: BsPerson,
    size: 29,
    linkName: "Profile",
  },
]

type HeaderProps = {
  auth: UserType
  isLoading: boolean
}

const Header: React.FC<HeaderProps> = ({ auth, isLoading }) => {
  const setPostOpen = usePostStore((store) => store.setPostOpen)
  const router = useRouter()

  return (
    <div className="col-span-3 hidden lg:block">
      <div className="sticky top-0">
        <Link
          href="/"
          aria-label="home - insider"
          className="focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
        >
          <div className="flex h-14 w-full items-center justify-center gap-3 text-2xl font-light text-white">
            {/* <div className="relative h-11 w-11">
              <Image layout="fill" src="/icons.svg" alt="Insider - Home" />
            </div> */}
            <span className="text-black">
              <TbCircles />
            </span>
            <span className="font-semibold uppercase text-black">Insider</span>
          </div>
        </Link>

        {isLoading ? (
          <UserSkeleton />
        ) : (
          <div className="rounded px-4 py-5">
            <div className="flex justify-start">
              <Link
                href={`profile`}
                aria-label="profile link"
                className="rounded-full ring-primary ring-offset-1 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary active:ring"
              >
                <div className="relative h-12 w-12">
                  <Image
                    layout="fill"
                    src={auth?.image || "/default-image.png"}
                    alt={auth?.name || ""}
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              </Link>
              <div className="ml-2 flex flex-col justify-center">
                <Link
                  href={`profile/${auth?.id || ""}`}
                  className="text-base font-semibold capitalize text-zinc-900 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-primary"
                >
                  {auth?.name}
                </Link>
                <span className="text-xs text-zinc-500">21 Followers</span>
              </div>
            </div>
          </div>
        )}
        <div className="mt-0">
          <nav className="w-full">
            <ul className="flex flex-col items-start space-y-2">
              <li className="flex flex-1 items-start">
                <Link
                  aria-label="Home"
                  href="/"
                  className={classNames(
                    "flex w-full items-center space-x-3 rounded-full px-4 py-2 text-zinc-900 focus:outline-none hover:bg-zinc-200",
                    "focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-zinc-300 active:text-zinc-800",
                    "transition duration-75",
                    router.asPath === "/" ? "bg-[#cec9ef]" : ""
                  )}
                >
                  <BiHomeCircle
                    aria-hidden="true"
                    size={29}
                    className="text-primary"
                  />
                  <span
                    className={classNames(
                      router.asPath === "/" ? "font-medium" : "font-normal",
                      "text-left text-lg text-zinc-900"
                    )}
                  >
                    Home
                  </span>
                </Link>
              </li>
              {LINKS.map((link) => (
                <li key={link.linkName} className="flex flex-1 items-start">
                  <Link
                    aria-label={link.linkName}
                    href={`${link.href}${
                      link.href.includes("profile") ? `/${auth?.id || ""}` : ""
                    }`}
                    className={classNames(
                      "flex w-full items-center space-x-3 rounded-full px-4 py-2 text-zinc-900 focus:outline-none hover:bg-zinc-200",
                      "focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-zinc-300 active:text-zinc-800",
                      "transition duration-75",
                      router.pathname.includes(link.href) ? "bg-[#cec9ef]" : ""
                    )}
                  >
                    <link.icon
                      aria-hidden="true"
                      size={link.size}
                      className="text-primary"
                    />
                    <span
                      className={classNames(
                        router.pathname.includes(link.href)
                          ? "font-medium"
                          : "font-normal",
                        "text-left text-lg text-zinc-900"
                      )}
                    >
                      {link.linkName}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="mt-3 w-full flex-1">
                <div className="flex w-full items-center justify-center">
                  <Button
                    onClick={() => setPostOpen(true)}
                    type="button"
                    aria-label="Create post"
                    className={classNames(
                      "flex h-12 w-full items-center justify-center gap-1 rounded-full bg-primary text-base text-white ",
                      "outline-offset-2 transition duration-75 focus:outline-none focus:ring focus:ring-offset-2 hover:bg-secondary active:bg-[#5544c8]"
                    )}
                  >
                    <FaEdit className="text-white" />
                    <span>Create Post</span>
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Header
