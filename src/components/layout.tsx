import React from "react"

type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <main className="mx-auto flex w-full flex-col">{children}</main>
}

export default Layout
