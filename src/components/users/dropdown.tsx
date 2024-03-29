import React from "react"
import Button from "../shared/button"
import Link from "next/link"
import { IoMdSettings } from "react-icons/io"
import { BiLogInCircle } from "react-icons/bi"
import { signOut } from "next-auth/react"
import classNames from "classnames"
import Image from "../shared/image"
import { isMobile } from "react-device-detect"
import { RiCloseFill } from "react-icons/ri"
import useNavStore from "@/store/nav"
import { useAuthQuery } from "@/lib/hooks/useQuery"
import { BsPerson, BsPeople } from "react-icons/bs"
import { SlPeople } from "react-icons/sl"

const LISTS = [
  {
    href: "/",
    linkName: "Profile",
    Icon: BsPerson,
  },
  {
    href: "/followers",
    linkName: "Followers",
    Icon: SlPeople,
  },
  {
    href: "/following",
    linkName: "Following",
    Icon: BsPeople,
  },
  {
    href: "/settings",
    linkName: "Setting",
    Icon: IoMdSettings,
  },
]

type DropdownProps = {
  className?: string
} & React.HTMLProps<HTMLElement>

const Dropdown = React.forwardRef<HTMLElement, DropdownProps>((props, ref) => {
  const { className, ...navProps } = props
  const { data: auth } = useAuthQuery()
  const setIsNavOpen = useNavStore((store) => store.setIsNavOpen)

  return (
    <nav
      ref={ref}
      className={classNames(
        "fixed inset-0 !right-0 z-50 w-64 select-none rounded-md bg-white p-4 shadow-lg transition md:absolute md:inset-[unset] md:top-14 md:p-2",
        className
      )}
      {...navProps}
    >
      {isMobile && (
        <div className="flex flex-col md:hidden">
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Account Info</span>
            <Button onClick={() => setIsNavOpen(false)} type="button">
              <RiCloseFill aria-hidden="true" size={25} />
            </Button>
          </div>
          <div className="mb-5 mt-10 flex flex-col">
            <Image
              className="rounded-full"
              src={auth?.image || " /default-image.png"}
              alt={auth?.name || ""}
              layout="fill"
              containerclassnames="relative h-[40px] w-[40px] mb-2"
            />
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">
                {auth?.name}
              </h3>
              <p className="text-sm text-zinc-600">{auth?.email}</p>
              <div className="mt-2 flex gap-4 text-sm text-zinc-600">
                <p>
                  <span className="mr-1 font-semibold">
                    {auth?._count?.followings}
                  </span>
                  Following
                </p>
                <p>
                  <span className="mr-1 font-semibold">
                    {auth?._count?.followers}
                  </span>
                  Followers
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3">
        <Button type="button" className="p-2">
          Light
        </Button>
        <Button type="button" className="p-2">
          Dark
        </Button>
        <Button type="button" className="p-2">
          System
        </Button>
      </div>
      <ul className="rounded-t-sm border-t border-zinc-200">
        {LISTS.map((list) => (
          <li
            key={list.linkName}
            className={classNames(
              "dark:hover:bg-primary-dark-200 flex items-center rounded-lg text-lg font-semibold hover:bg-slate-100 md:text-base md:font-normal"
            )}
          >
            <Link
              className="flex w-full items-center rounded-lg p-2"
              href={list.href}
            >
              <list.Icon aria-hidden="true" />
              <span className="ml-2">{list.linkName}</span>
            </Link>
          </li>
        ))}
        <li className="dark:hover:bg-primary-dark-200 rounded-lg text-lg font-semibold hover:bg-slate-100 md:text-base md:font-normal">
          <button
            onClick={() => signOut()}
            type="button"
            className="flex w-full items-center rounded-lg p-2"
          >
            <BiLogInCircle />
            <span className="ml-2">Log Out</span>
          </button>
        </li>
      </ul>
    </nav>
  )
})

Dropdown.displayName = "Dropdown"

export default Dropdown
