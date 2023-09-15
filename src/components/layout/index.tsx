import useNavStore from "@/store/nav"
import React, { useEffect, useRef, useCallback } from "react"
import Dropdown from "../users/dropdown"
import MobileNav from "./mobile-nav"
import useClickOutside from "@/lib/hooks/useClickOutside"

type LayoutProps = {
  children: React.ReactNode
  isHome?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, isHome = true }) => {
  const [isNavOpen, setIsNavOpen] = useNavStore((store) => [
    store.isNavOpen,
    store.setIsNavOpen,
  ])
  const ref = useRef<HTMLElement | null>(null)

  const hideNav = useCallback(() => {
    setIsNavOpen(false)
  }, [setIsNavOpen])

  useClickOutside(ref, () => hideNav())

  useEffect(() => {
    isNavOpen && (document.body.style.overflow = "hidden")

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isNavOpen])

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex w-full flex-col">{children}</main>
      {isHome && <MobileNav />}
      {isNavOpen && (
        <React.Fragment>
          <span
            onClick={hideNav}
            className="absolute inset-0 z-50 bg-gradient-to-r from-[#00000080] to-[#00000080]"
          ></span>
          <Dropdown ref={ref} />
        </React.Fragment>
      )}
    </div>
  )
}

export default Layout
