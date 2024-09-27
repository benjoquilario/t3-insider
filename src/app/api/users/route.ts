import db from "@/lib/db"
import { auth } from "@/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")
  const session = await auth()

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      _count: {
        select: {
          followers: true,
        },
      },
    },
    where: {
      NOT: {
        email: session?.user.email,
      },
    },
    orderBy: { createdAt: "desc" },
    take: Number(limit) || 5,
    skip: Number(skip) || 0,
  })

  const nextId =
    users.length < Number(limit) ? undefined : users[Number(limit) - 1].id

  if (users.length === 0) {
    return NextResponse.json({
      comments: [],
      hasNextPage: false,
      nextSkip: null,
    })
  }

  return NextResponse.json({
    users,
    hasNextPage: users.length < (Number(limit) || 5) ? false : true,
    nextSkip:
      users.length < (Number(limit) || 5)
        ? null
        : Number(skip) + (Number(limit) as number),
  })
}
