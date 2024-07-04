import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register - Insider",
}

const RegisterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  )
}

export default RegisterLayout
