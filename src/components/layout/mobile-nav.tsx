import React from "react";
import { LINKS } from "./header";
import Link from "next/link";
import classNames from "classnames";
import { useAuthQuery } from "@/lib/hooks/useQuery";
import { useRouter } from "next/router";
import type { User as UserType } from "@/types/types";
import { useSession } from "next-auth/react";

type MobileNav = {
  auth: UserType;
};

const MobileNav: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="fixed bottom-0 right-0 left-0 z-20 rounded-t-3xl bg-zinc-50 py-1 px-3 shadow-md ring ring-zinc-100 lg:hidden">
      <ul className="flex items-center justify-around gap-3 text-white">
        {LINKS.map((link) => (
          <li key={link.linkName} className="">
            <Link
              className="flex flex-col items-center p-1"
              href={`${link.href}${
                link.href.includes("profile")
                  ? `/${session?.user?.id || ""}`
                  : ""
              }`}
            >
              <link.icon
                aria-hidden="true"
                size={22}
                className="m-0 text-zinc-700"
              />
              <span className="text-center text-xs font-semibold text-zinc-700 md:block">
                {link.linkName}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileNav;
