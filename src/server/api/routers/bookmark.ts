import { createTRPCRouter, protectedProcedure } from "../trpc"
import z from "zod"

export const bookmarkRouter = createTRPCRouter({
  createBookmark: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.bookmark.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      })
    }),
  deleteBookmark: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const bookmark = await ctx.prisma.bookmark.findUnique({
        where: {
          id: input.id,
        },
      })

      if (bookmark) {
        await ctx.prisma.bookmark.delete({
          where: {
            id: bookmark.id,
          },
        })
      }

      return {
        message: "Successfully Deleted!!",
      }
    }),
})
