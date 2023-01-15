import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#edf1f5]">
      <main className="mx-auto flex w-full flex-col">{children}</main>
    </div>
  );
};

export default Layout;
