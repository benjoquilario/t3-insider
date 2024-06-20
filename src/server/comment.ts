"use server"

import { auth } from "@/auth"
import db from "@/lib/db"

export async function createComment(comment: ICreateComment) {
  const { commentText, postId } = comment

  const session = await auth()

  if (!session) throw new Error("Not authenticated!")

  const createdComment = await db.comment.create({
    data: {
      comment: commentText,
      postId: postId,
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      commentLike: {
        select: {
          id: true,
        },
        where: {
          userId: session?.user.id,
        },
      },
      _count: {
        select: {
          commentLike: true,
        },
      },
    },
  })

  console.log(createdComment)

  return {
    data: createdComment,
    message: "Comment Created",
    ok: true,
  }
}

export async function updateComment({
  comment,
  commentId,
}: {
  comment: string
  commentId: string
}) {
  const session = await auth()

  if (!session) return

  const updatedComment = await db.comment.update({
    where: {
      id: commentId,
    },
    data: {
      comment,
    },
  })

  return {
    ok: true,
    data: updatedComment,
    message: "Comment Updated",
  }
}

export const deleteComment = async ({ commentId }: { commentId: string }) => {
  const session = await auth()

  if (!session)
    return {
      ok: false,
      message: "Unathenticated",
    }

  const comment = await db.comment.findUnique({
    where: {
      id: commentId,
    },
  })

  if (comment) {
    await db.comment.delete({
      where: {
        id: comment.id,
      },
    })
  }
}
