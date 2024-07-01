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
    include: {
      _count: {
        select: {
          followers: true,
        },
      },
    },
  })

  if (!currentUser) return null

  return currentUser
}

export async function getUserById({ userId }: { userId: string }) {
  const session = await auth()

  if (!session) return
  const sessionId = session.user.id

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      followers: {
        where: {
          followerId: sessionId!,
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) return null

  const followerCount = user._count.followers
  const followingCount = user._count.following

  const { followers, _count, ...rest } = user

  return {
    ...rest,
    name: rest.name!,
    username: rest.username!,
    followerCount,
    followingCount,
    isFollowing: user.followers.length === 1,
  }
}
