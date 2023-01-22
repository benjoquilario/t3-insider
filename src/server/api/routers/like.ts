import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const likeRouter = createTRPCRouter({
  likePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const like = await ctx.prisma.likes.findMany({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });

      if (like.length > 0) {
        await ctx.prisma.likes.delete({
          where: {
            id: like[0]?.id,
          },
        });
      } else {
        await ctx.prisma.likes.create({
          data: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        });
      }
    }),
});
