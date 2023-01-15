import { createPostSchema, postSchema } from "@/server/schema/post";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const newPost = await ctx.prisma.post.create({
        data: {
          message: input.message,
          name: input?.name || ctx.session.user.name || "",
          selectedFile: input?.selectedFile || "",
          userId: ctx.session.user.id,
        },
      });

      return {
        post: newPost,
      };
    }),
  getPosts: protectedProcedure
    .input(postSchema)
    .query(async ({ ctx, input }) => {
      const skip = input?.cursor || 0;
      const posts = await ctx.prisma.post.findMany({
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
        take: input?.limit || 3,
        skip,
      });

      return {
        posts: posts.map((post) => post),
        hasNextPage: posts.length < (input.limit || 3) ? false : true,
        nextSkip:
          posts.length < (input.limit || 3)
            ? null
            : skip + (input.limit as number),
      };
    }),
});
