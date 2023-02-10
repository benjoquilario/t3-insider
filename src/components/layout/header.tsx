/* eslint-disable @typescript-eslint/no-misused-promises */
import Link from "next/link";
import Image from "next/legacy/image";
import { BsPeopleFill, BsFillPersonFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import classNames from "classnames";
import Button from "@/components/shared/button";
import { signOut } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import React from "react";

const LINKS = [
  {
    href: "/",
    icon: AiFillHome,
    size: 29,
    linkName: "Home",
  },
  {
    href: "/followers",
    icon: BsPeopleFill,
    size: 29,
    linkName: "Followers",
  },
  {
    href: "/following",
    icon: IoIosPeople,
    size: 29,
    linkName: "Following",
  },
  {
    href: "/profile",
    icon: BsFillPersonFill,
    size: 29,
    linkName: "Profile",
  },
];

const Header = () => {
  const { data: authUser } = trpc.user.authUser.useQuery();

  return (
    <div className="col-span-3 hidden lg:block">
      <div className="sticky top-0">
        <Link href="/" aria-label="home - insider">
          <div className="flex h-14 w-full items-center justify-center gap-3 text-2xl font-light text-white">
            <div className="relative h-11 w-11">
              <Image layout="fill" src="/icons.svg" alt="Insider - Home" />
            </div>
            <span className="font-semibold uppercase text-black">Insider</span>
          </div>
        </Link>

        <div className="rounded px-4 py-5">
          <div className="flex justify-start">
            <Link href={`profile`} aria-label="profile link">
              <div className="relative h-12 w-12">
                <Image
                  layout="fill"
                  src={authUser?.image || ""}
                  alt={authUser?.name || ""}
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </Link>
            <div className="ml-2 flex flex-col justify-center">
              <Link
                href={`profile/${authUser?.id || ""}`}
                className="text-base font-semibold capitalize text-black"
              >
                {authUser?.name}
              </Link>
              <span className="text-xs text-gray-500">21 Followers</span>
            </div>
          </div>
        </div>
        <div className="mt-0">
          <nav className="w-full">
            <ul className="flex flex-col items-start space-y-2">
              {LINKS.map((link) => (
                <li key={link.linkName} className="flex flex-1 items-start">
                  <Link
                    aria-label={link.linkName}
                    href={`${link.href}${
                      link.href.includes("profile")
                        ? `/${authUser?.id || ""}`
                        : ""
                    }`}
                    className={classNames(
                      "flex w-full items-center gap-4 rounded-full py-2 px-4 hover:bg-[#e0e4e9]"
                    )}
                  >
                    <link.icon
                      aria-hidden="true"
                      size={link.size}
                      className="text-[#6a55fa]"
                    />
                    <span className="text-left text-lg text-black">
                      {link.linkName}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="mt-3 w-full flex-1">
                <div className="flex w-full items-center justify-center">
                  <Button
                    onClick={() => signOut()}
                    type="button"
                    aria-label="Create post"
                    className="flex h-12 w-full items-center justify-center rounded-full bg-[#6a55fa] text-base text-white transition duration-75 hover:bg-[#8371f8]"
                  >
                    Create Post
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
