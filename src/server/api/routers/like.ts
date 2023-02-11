import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const likeRouter = createTRPCRouter({
  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        isLiked: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isLikeExist = await ctx.prisma.likes.findMany({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });

      if (!input.isLiked && isLikeExist.length > 0) {
        await ctx.prisma.likes.delete({
          where: {
            id: isLikeExist[0]?.id,
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

      return {
        message: "OK",
      };
    }),
  likeComment: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        commentId: z.string(),
        isLiked: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.isLiked) {
        await ctx.prisma.likeComment.create({
          data: {
            commentId: input.commentId,
            userId: ctx.session.user.id,
          },
        });
      } else {
        await ctx.prisma.likeComment.delete({
          where: {
            id: input.id,
          },
        });
      }

      return {
        message: "OK",
      };
    }),
  likeReplyComment: protectedProcedure
    .input(
      z.object({
        replyId: z.string(),
        isLiked: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isLikeExist = await ctx.prisma.likeReplyComment.findMany({
        where: {
          replyId: input.replyId,
          userId: ctx.session.user.id,
        },
      });

      if (!input.isLiked && isLikeExist.length > 0) {
        await ctx.prisma.likeReplyComment.delete({
          where: {
            id: isLikeExist[0]?.id,
          },
        });
      } else {
        await ctx.prisma.likeReplyComment.create({
          data: {
            replyId: input.replyId,
            userId: ctx.session.user.id,
          },
        });
      }

      return {
        message: "OK",
      };
    }),
});
