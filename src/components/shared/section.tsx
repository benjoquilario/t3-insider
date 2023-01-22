import React from "react";
import Header from "../layout/header";

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
    <div className="mx-auto grid h-full min-h-screen w-full max-w-screen-2xl grid-cols-12 gap-6 p-3 md:p-5">
      {showHeader && <Header />}
      {children}
      {showFooter && <footer>Footer.</footer>}
    </div>
  );
};

export default Section;
