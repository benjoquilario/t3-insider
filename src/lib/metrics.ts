"use server"
import db from "@/lib/db"

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
