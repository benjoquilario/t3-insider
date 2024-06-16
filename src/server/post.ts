"use server"

import { auth } from "@/auth"
import db from "@/lib/db"

export const createPost = async (values: ICreatePost) => {
  const session = await auth()

  if (!session) return

  const userId = session.user.id
  // const name = session.user.name

  const { content, selectedFile } = values

  const newPost = await db.post.create({
    data: {
      content: content,
      userId,
    },
    include: {
      selectedFile: true,
    },
  })

  if (selectedFile?.length) {
    await db.selectedFile.createMany({
      data: selectedFile.map((file) => ({
        url: file.url,
        postId: newPost.id,
      })),
    })
  }

  return {
    data: newPost,
    message: "success",
  }
}

export const updatePost = async (values: IUpdatePost) => {
  const session = await auth()

  if (!session) return
  const { content, selectedFile, postId } = values

  const updatedPost = await db.post.update({
    where: {
      id: postId,
    },
    data: {
      content: content,
    },
    include: {
      selectedFile: true,
    },
  })

  if (selectedFile?.length) {
    await db.selectedFile.createMany({
      data: selectedFile.map((file) => ({
        url: file.url,
        postId: updatedPost.id,
      })),
    })
  }

  return {
    ok: true,
    data: updatedPost,
    message: "Post Updated",
  }
}

export const deletePost = async ({ postId }: { postId: string }) => {
  const session = await auth()

  if (!session)
    return {
      ok: false,
      message: "Unathenticated",
    }

  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (post) {
    await db.post.delete({
      where: {
        id: post.id,
      },
      include: {
        selectedFile: {
          where: {
            postId: post.id,
          },
        },
      },
    })
  }
}
