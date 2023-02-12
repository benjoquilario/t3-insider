import React from "react";
import Header from "@/components/layout/header";
import Users from "@/components/users";
import { useAuthQuery } from "@/lib/hooks/useQuery";
import type { User as UserType } from "@/types/types";

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
  const { data: authUser, isLoading } = useAuthQuery();

  return (
    <div className="mx-auto grid h-full min-h-screen w-full max-w-screen-2xl grid-cols-12 gap-6 p-1 pb-[52px] md:py-4 md:px-10">
      {showHeader && (
        <Header auth={authUser as UserType} isLoading={isLoading} />
      )}
      {children}
      <div className="hidden xl:col-span-3 xl:block">
        <Users auth={authUser as UserType} isLoading={isLoading} />
      </div>
      {showFooter && <footer>Footer.</footer>}
    </div>
  );
};

export default Section;
