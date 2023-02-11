import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const followRouter = createTRPCRouter({
  followUser: protectedProcedure
    .input(
      z.object({
        followingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isFollow = await ctx.prisma.follow.findMany({
        where: {
          followingId: input.followingId,
          followerId: ctx.session.user.id,
        },
      });

      if (isFollow.length > 0) {
        await ctx.prisma.follow.delete({
          where: {
            id: isFollow[0]?.id,
          },
        });
      } else {
        await ctx.prisma.follow.create({
          data: {
            followingId: input.followingId,
            followerId: ctx.session.user.id,
          },
        });
      }

      return {
        message: "OK",
      };
    }),
});
