import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { userIdSchema } from "@/server/schema/user";

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
  getFollowers: protectedProcedure
    .input(userIdSchema.optional())
    .query(async ({ ctx }) => {
      const followers = await ctx.prisma.follow.findMany({
        where: {
          followingId: ctx.session.user.id,
        },
        select: {
          follower: true,
        },
      });

      return followers.map((follower) => follower.follower);
    }),
});
