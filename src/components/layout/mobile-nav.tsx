import React from "react";
import { LINKS } from "./header";
import Link from "next/link";
import classNames from "classnames";
import { useRouter } from "next/router";
import type { User as UserType } from "@/types/types";
import { useSession } from "next-auth/react";
import Button from "@/components/shared/button";

type MobileNav = {
  auth: UserType;
};

const MobileNav: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="fixed bottom-0 right-0 left-0 z-20 rounded-t-3xl bg-zinc-50 py-1 px-3 shadow-md ring ring-zinc-100 md:hidden">
      <ul className="flex items-center justify-around gap-3 text-white">
        {LINKS.map((link) => (
          <li key={link.linkName} className="">
            <Button
              className={classNames(
                router.pathname.includes(link.href)
                  ? "bg-[#cec9ef] text-primary"
                  : "text-zinc-700",
                "flex h-12 w-16 flex-col items-center rounded-full p-1 text-zinc-700 hover:bg-zinc-200 active:scale-105"
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
              <link.icon aria-hidden="true" size={22} className="m-0 " />
              <span className="text-center text-xs font-semibold md:block">
                {link.linkName}
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileNav;
