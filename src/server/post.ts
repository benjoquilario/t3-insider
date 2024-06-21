"use server"

import { auth } from "@/auth"
import db from "@/lib/db"
import { UTApi } from "uploadthing/server"

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
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      selectedFile: true,
      likePost: true,
    },
  })

  if (selectedFile?.length) {
    await db.selectedFile.createMany({
      data: selectedFile.map((file) => ({
        url: file.url,
        key: file.key,
        postId: newPost.id,
      })),
    })
  }

  return {
    data: newPost,
    message: "success",
  }
}

export const updatePost = async (
  values: IUpdatePost & { fileIds: string[]; deletedKeys: string[] }
) => {
  const session = await auth()
  const utapi = new UTApi()

  if (!session) return
  const { content, selectedFile, postId, fileIds, deletedKeys } = values

  if (fileIds.length && deletedKeys.length) {
    await db.selectedFile.deleteMany({
      where: {
        id: {
          in: fileIds,
        },
      },
    })

    await utapi.deleteFiles(deletedKeys)
  }

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
        key: file.key,
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
  const utapi = new UTApi()

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

  const selectedFiles = await db.selectedFile.findMany({
    where: {
      postId: post?.id,
    },
  })

  if (selectedFiles) {
    const selectedFileKey = selectedFiles.map((files) => files.key)

    await utapi.deleteFiles(selectedFileKey)
  }

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
