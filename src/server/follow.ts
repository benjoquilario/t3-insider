"use server"

import { auth } from "@/auth"
import db from "@/lib/db"

export const follow = async function ({
  userIdToFollow,
}: {
  userIdToFollow: string
}) {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  await db.follow.create({
    data: {
      followerId: userId!,
      followingId: userIdToFollow,
    },
  })

  return
}

export const unFollow = async function ({
  userIdToFollow,
}: {
  userIdToFollow: string
}) {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  const isFollowing = await db.follow.count({
    where: {
      followerId: userId!,
      followingId: userIdToFollow,
    },
  })

  if (isFollowing) {
    await db.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId!,
          followingId: userIdToFollow,
        },
      },
    })
  }

  return
}
