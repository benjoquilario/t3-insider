"use server"

import { auth } from "@/auth"
import db from "@/lib/db"

export const likePost = async ({ postId }: { postId: string }) => {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  const isLiked = await db.likePost.count({
    where: {
      userId,
      postId,
    },
  })

  if (isLiked) {
    return {
      ok: false,
      status: 409,
    }
  }

  await db.likePost.create({
    data: {
      userId: userId!,
      postId,
    },
    select: {
      userId: true,
    },
  })

  return
}

export const unlikePost = async ({ postId }: { postId: string }) => {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  const isLiked = await db.likePost.count({
    where: {
      userId,
      postId,
    },
  })

  const likeExist = await db.likePost.findFirst({
    where: {
      userId,
      postId,
    },
  })

  if (!isLiked && !likeExist) {
    return {
      ok: false,
      status: 409,
    }
  }

  await db.commentLike.delete({
    where: {
      id: likeExist?.id,
    },
  })

  return
}
