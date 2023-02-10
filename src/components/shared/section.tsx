import React from "react";
import Header from "../layout/header";
import Users from "@/components/users";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

type SectionProps = {
  children: React.ReactNode;
  showFooter?: boolean;
  showHeader?: boolean;
};

const Section: React.FC<SectionProps> = ({
  children,
  showFooter = false,
  showHeader = true,
}) => {
  return (
    <div className="mx-auto grid h-full min-h-screen w-full max-w-screen-2xl grid-cols-12 gap-6 p-3 md:py-4 md:px-10">
      {showHeader && <Header />}
      {children}
      <div className="hidden xl:col-span-3 xl:block">
        <Users />
      </div>
      {showFooter && <footer>Footer.</footer>}
    </div>
  );
};

export default Section;
