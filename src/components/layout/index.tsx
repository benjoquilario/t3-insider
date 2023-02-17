import useNavStore from "@/store/nav";
import React from "react";
import Dropdown from "../users/dropdown";
import MobileNav from "./mobile-nav";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isNavOpen = useNavStore((store) => store.isNavOpen);

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex w-full flex-col">{children}</main>
      <MobileNav />
      {isNavOpen && (
        <React.Fragment>
          <span className="absolute inset-0 z-50 bg-gradient-to-r from-[#00000080] to-[#00000080]"></span>
          <Dropdown />
        </React.Fragment>
      )}
    </div>
  );
};

export default Layout;
