import type { Metadata } from "next"
import "./globals.css"
import QueryProvider from "@/components/query-provider"
import AuthProvider from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import HolyLoader from "holy-loader"
import { GeistSans } from "geist/font/sans"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

const fontSans = GeistSans

export const metadata: Metadata = {
  title: "Insider",
  description:
    "A Fullstack social media application intended to make a community, friends, and make the world more open and connected.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body
        className={cn(
          "font-geist-sans bg-background antialiased",
          fontSans.variable
        )}
      >
        <HolyLoader
          color="#6d28d9"
          height="4px"
          speed={250}
          easing="linear"
          showSpinner
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
