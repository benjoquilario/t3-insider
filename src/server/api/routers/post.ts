import {
  createPostSchema,
  postSchema,
  postIdSchema,
} from "@/server/schema/post";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const newPost = await ctx.prisma.post.create({
        data: {
          message: input.message,
          name: input?.name || ctx.session.user.name || "",
          userId: ctx.session.user.id,
        },
      });

      if (input.selectedFile?.length) {
        await ctx.prisma.selectedFile.createMany({
          data: input.selectedFile.map((image) => ({
            url: image.url,
            fallbackUrl: image.fallbackUrl,
            height: image.height,
            width: image.width,
            postId: newPost.id,
          })),
        });
      }

      return {
        message: "Success",
      };
    }),
  updatePost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const updatePost = await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          message: input.message,
          name: input?.name || ctx.session.user.name || "",
        },
      });

      if (input.selectedFile?.length) {
        await ctx.prisma.selectedFile.createMany({
          data: input.selectedFile.map((image) => ({
            url: image.url,
            fallbackUrl: image.fallbackUrl,
            height: image.height,
            width: image.width,
            postId: updatePost.id,
          })),
        });
      }
    }),
  deletePost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (post) {
        await ctx.prisma.post.delete({
          where: {
            id: post.id,
          },
        });
      }

      await ctx.prisma.selectedFile.deleteMany({
        where: {
          postId: post?.id,
        },
      });

      return {
        message: "Successfully Deleted!!",
      };
    }),
  getPosts: protectedProcedure
    .input(postSchema)
    .query(async ({ ctx, input }) => {
      const skip = input?.cursor || 0;
      const posts = await ctx.prisma.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          likes: {
            select: {
              id: true,
              postId: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comment: true,
            },
          },
          selectedFile: true,
        },

        orderBy: { createdAt: "desc" },
        take: input?.limit || 3,
        skip,
      });

      const isLiked = await ctx.prisma.likes.findMany({
        where: {
          userId: ctx.session.user.id,
          postId: { in: posts.map((post) => post.id) },
        },
      });

      return {
        posts: posts.map((post) => ({
          ...post,
          isLike: isLiked.some((like) => post.id === like.postId),
        })),
        hasNextPage: posts.length < (input.limit || 3) ? false : true,
        nextSkip:
          posts.length < (input.limit || 3)
            ? null
            : skip + (input.limit as number),
      };
    }),
  getPostById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          selectedFile: true,
        },
      });

      return post;
    }),
  getPostsById: protectedProcedure
    .input(postIdSchema)
    .query(async ({ ctx, input }) => {
      const skip = input?.cursor || 0;
      const posts = await ctx.prisma.post.findMany({
        where: {
          userId: input.id,
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
          likes: {
            select: {
              id: true,
              postId: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comment: true,
            },
          },
          selectedFile: true,
        },
        orderBy: { createdAt: "desc" },
        take: input?.limit || 3,
        skip,
      });

      const isLiked = await ctx.prisma.likes.findMany({
        where: {
          userId: ctx.session.user.id,
          postId: { in: posts.map((post) => post.id) },
        },
      });

      return {
        posts: posts.map((post) => ({
          ...post,
          isLike: isLiked.some((like) => post.id === like.postId),
        })),
        hasNextPage: posts.length < (input.limit || 3) ? false : true,
        nextSkip:
          posts.length < (input.limit || 3)
            ? null
            : skip + (input.limit as number),
      };
    }),
});
