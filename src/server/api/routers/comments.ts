import { createCommentSchema, commentSchema } from "@/server/schema/comments";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { commentIdSchema } from "../../schema/comments";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          comment: input.comment,
          userId: ctx.session.user.id,
          postId: input.postId,
        },
      });

      return {
        comment,
      };
    }),
  updateComment: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          comment: input.comment,
        },
      });
    }),
  deleteComment: protectedProcedure
    .input(commentIdSchema)
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.id,
        },
      });

      if (comment) {
        await ctx.prisma.comment.delete({
          where: {
            id: comment.id,
          },
        });
      }

      await ctx.prisma.replyComment.deleteMany({
        where: {
          replyToId: comment?.id,
        },
      });

      return {
        message: "Successfully Deleted!!",
      };
    }),
  getCommentById: protectedProcedure
    .input(commentIdSchema)
    .query(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.id,
        },
      });

      return comment;
    }),
  getComments: protectedProcedure
    .input(commentSchema)
    .query(async ({ ctx, input }) => {
      const skip = input?.cursor || 0;
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          likeComment: {
            select: {
              id: true,
              commentId: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },

          _count: {
            select: {
              likeComment: true,
              reply: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input?.limit || 3,
        skip,
      });

      const isLiked = await ctx.prisma.likeComment.findMany({
        where: {
          userId: ctx.session.user.id,
          commentId: { in: comments.map((comment) => comment.id) },
        },
      });

      return {
        comments: comments.map((comment) => ({
          ...comment,
          isLike: isLiked.some((like) => comment.id === like.commentId),
        })),
        hasNextPage: comments.length < (input.limit || 3) ? false : true,
        nextSkip:
          comments.length < (input.limit || 3)
            ? null
            : skip + (input.limit as number),
      };
    }),
  replyComment: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.replyComment.create({
        data: {
          comment: input.comment,
          userId: ctx.session.user.id,
          replyToId: input.commentId,
        },
      });

      return {
        comment,
      };
    }),
  updateReplyComment: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.replyComment.update({
        where: {
          id: input.id,
        },
        data: {
          comment: input.comment,
        },
      });
    }),
  getReplyComments: protectedProcedure
    .input(commentSchema)
    .query(async ({ ctx, input }) => {
      const skip = input?.cursor || 0;
      const comments = await ctx.prisma.replyComment.findMany({
        where: {
          replyToId: input.commentId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          likeReplyComments: {
            select: {
              id: true,
              replyId: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              likeReplyComments: true,
            },
          },
        },

        orderBy: { createdAt: "desc" },
        take: input?.limit || 3,
        skip,
      });

      return {
        replyComments: comments.map((comment) => comment),
        hasNextPage: comments.length < (input.limit || 3) ? false : true,
        nextSkip:
          comments.length < (input.limit || 3)
            ? null
            : skip + (input.limit as number),
      };
    }),
});
