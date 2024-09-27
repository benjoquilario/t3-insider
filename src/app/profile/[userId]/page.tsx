import { auth } from "@/auth"
import Profile from "../_components/profile"
import { redirect } from "next/navigation"

const ProfilePage = async ({ params }: { params: { userId: string } }) => {
  const userId = params.userId

  const isAuth = await auth()

  if (!isAuth) redirect("/login")

  const isCurrentUser = isAuth.user.id === userId

  return <Profile userId={userId} isCurrentUser={isCurrentUser} />
}

export default ProfilePage
