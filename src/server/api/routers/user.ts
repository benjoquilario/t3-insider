import {
  userIdSchema,
  userProfileSchema,
  userSchema,
} from "@/server/schema/user"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .input(userSchema)
    .query(async ({ ctx, input }) => {
      const skip = input?.cursor || 0
      const users = await ctx.prisma.user.findMany({
        select: {
          _count: {
            select: {
              likes: true,
              comment: true,
            },
          },
          id: true,
          coverPhoto: true,
          image: true,
          name: true,
        },
        orderBy: { createdAt: "desc" },
        take: input?.limit || 3,
        skip,
      })
      return {
        users: users.map((user) => user),
        hasNextPage: users.length < (input.limit || 3) ? false : true,
        nextSkip:
          users.length < (input.limit || 3)
            ? null
            : skip + (input.limit as number),
      }
    }),
  getUserById: protectedProcedure
    .input(userIdSchema)
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          email: true,
          coverPhoto: true,
          image: true,
          _count: {
            select: {
              followers: true,
              followings: true,
            },
          },
        },
      })

      if (!user) throw new Error(`no user with ${input.id}`)

      const followByMe = await ctx.prisma.follow.findFirst({
        where: {
          followerId: ctx.session.user.id,
          followingId: user.id,
        },
      })

      return {
        ...user,
        followedByMe: Boolean(followByMe),
      }
    }),
  authUser: protectedProcedure
    .input(userIdSchema.optional())
    .query(async ({ ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          _count: {
            select: {
              followers: true,
              followings: true,
            },
          },
        },
      })
    }),
  uploadPhoto: protectedProcedure
    .input(userProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      })

      if (user) {
        await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            image: input.image,
            coverPhoto: input.coverPhoto,
          },
        })
      }
    }),
})
