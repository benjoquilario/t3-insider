import db from "@/lib/db"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")
  const session = await auth()

  const posts = await db.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      likePost: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          likePost: true,
        },
      },
      selectedFile: true,
    },
    orderBy: { createdAt: "desc" },
    take: Number(limit) || 5,
    skip: Number(skip) || 0,
  })

  const nextId =
    posts.length < Number(limit) ? undefined : posts[Number(limit) - 1].id

  if (posts.length === 0) {
    return NextResponse.json({
      comments: [],
      hasNextPage: false,
      nextSkip: null,
    })
  }

  const transformedPosts = posts.map((post) => {
    const { _count, ...rest } = post
    return {
      ...rest,
      _count,
      isLiked: session ? _count.likePost > 0 : false,
    }
  })

  return NextResponse.json({
    posts: transformedPosts,
    hasNextPage: posts.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      posts.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  })
}
