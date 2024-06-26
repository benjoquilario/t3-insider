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

  await db.likePost.delete({
    where: {
      id: likeExist?.id,
    },
  })

  return
}

export const likeComment = async ({ commentId }: { commentId: string }) => {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  const isLiked = await db.commentLike.count({
    where: {
      userId,
      commentId,
    },
  })

  if (isLiked) {
    return {
      ok: false,
      status: 409,
    }
  }

  await db.commentLike.create({
    data: {
      userId: userId!,
      commentId,
    },
    select: {
      userId: true,
    },
  })

  return
}

export const unlikeComment = async ({ commentId }: { commentId: string }) => {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  console.log(session)

  const isLiked = await db.commentLike.count({
    where: {
      userId,
      commentId,
    },
  })

  const likeExist = await db.commentLike.findFirst({
    where: {
      userId,
      commentId,
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

export const likeReplyComment = async ({ replyId }: { replyId: string }) => {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  const isLiked = await db.likeReplyComment.count({
    where: {
      userId,
      replyId,
    },
  })

  if (isLiked) {
    return {
      ok: false,
      status: 409,
    }
  }

  await db.likeReplyComment.create({
    data: {
      userId: userId!,
      replyId,
    },
    select: {
      userId: true,
    },
  })

  return
}

export const unlikeReplyComment = async ({ replyId }: { replyId: string }) => {
  const session = await auth()
  const userId = session?.user.id

  if (!session) return

  console.log(session)

  const isLiked = await db.likeReplyComment.count({
    where: {
      userId,
      replyId,
    },
  })

  const likeExist = await db.likeReplyComment.findFirst({
    where: {
      userId,
      replyId,
    },
  })

  if (!isLiked && !likeExist) {
    return {
      ok: false,
      status: 409,
    }
  }

  await db.likeReplyComment.delete({
    where: {
      id: likeExist?.id,
    },
  })

  return
}
