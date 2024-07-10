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

  const follow = await db.follow.create({
    data: {
      followerId: userId!,
      followingId: userIdToFollow,
    },
  })

  if (follow) {
    await db.activity.create({
      data: {
        type: "FOLLOW_USER",
        sourceUserId: userId!,
        targetId: follow.followingId,
        contentId: userIdToFollow,
        content: "",
      },
    })
  }

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
