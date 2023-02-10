import React from "react";
import Button from "../shared/button";
import Link from "next/link";
import { BsFillPersonFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { BiLogInCircle } from "react-icons/bi";
import { signOut } from "next-auth/react";
import classNames from "classnames";

type DropdownProps = {
  className?: string;
} & React.HTMLProps<HTMLElement>;

const Dropdown = React.forwardRef<HTMLElement, DropdownProps>((props, ref) => {
  const { className, ...navProps } = props;

  return (
    <nav
      ref={ref}
      className={classNames(
        "absolute top-14 right-0 z-50 select-none rounded-md bg-white p-2 shadow-lg",
        className
      )}
      {...navProps}
    >
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
        <li className="dark:hover:bg-primary-dark-200 flex items-center rounded-lg text-base hover:bg-slate-100">
          <Link
            className="flex w-full items-center rounded-lg p-2"
            href="/user/cld1cbi13000608l82mu8r8xi"
          >
            <BsFillPersonFill />
            <span className="ml-2">Profile</span>
          </Link>
        </li>

        <li className="dark:hover:bg-primary-dark-200 flex w-full items-center rounded-lg text-base hover:bg-slate-100">
          <Link
            className="relative flex w-full items-center rounded-lg p-2"
            href="/notifications"
          >
            <IoMdSettings />
            <span className="ml-2">Settings</span>
          </Link>
        </li>
        <li className="dark:hover:bg-primary-dark-200 rounded-lg text-base hover:bg-slate-100">
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
  );
});

Dropdown.displayName = "Dropdown";

export default Dropdown;
