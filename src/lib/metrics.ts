"use server"
import db from "@/lib/db"
import { auth } from "@/auth"

export const getPosts = async () => {
  const posts = await db.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      _count: {
        select: {
          likePost: true,
          // comment: true,
        },
      },
      selectedFile: true,
    },

    orderBy: { createdAt: "desc" },
  })

  return posts
}

export async function getCurrentUser() {
  const session = await auth()

  if (!session?.user.id) return null

  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      cover: true,
      email: true,
      image: true,
      name: true,
      createdAt: true,
    },
  })

  if (!currentUser) return null

  return currentUser
}

export async function getUserById({ userId }: { userId: string }) {
  const user = await db.user.findUnique({
    where: { id: userId },
  })

  if (!user) return null

  return user
}
