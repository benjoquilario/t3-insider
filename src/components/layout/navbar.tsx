import React from "react";
import Button from "@/components/shared/button";
import Image from "@/components/shared/image";
import { FiSearch } from "react-icons/fi";
import type { User } from "@/types/types";
import useNavStore from "@/store/nav";

type NavBarProps = {
  auth: User;
};

const NavBar: React.FC<NavBarProps> = ({ auth }) => {
  const [isNavOpen, setIsNavOpen] = useNavStore((store) => [
    store.isNavOpen,
    store.setIsNavOpen,
  ]);

  const toggleNavBar = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="block shadow-md md:hidden">
      <div className="flex items-center justify-between px-3 py-1">
        <div>
          <Button
            onClick={toggleNavBar}
            className="w-18 flextoggleNavBar  h-14 items-center justify-center rounded-full hover:opacity-90"
            aria-label="dropdown profile"
            type="button"
          >
            <Image
              className="rounded-full"
              src={auth?.image || "/default-image.png"}
              alt={""}
              layout="fill"
              containerclassnames="relative h-[40px] w-[40px]"
            />
          </Button>
        </div>
        <div>
          <span className="font-semibold uppercase text-black">Insider</span>
        </div>
        <div>
          <Button type="button" className="text-md text-zinc-900">
            <FiSearch className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
