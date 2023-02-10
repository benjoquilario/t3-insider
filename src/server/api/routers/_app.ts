import { createTRPCRouter, publicProcedure } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { commentRouter } from "./comments";
import { likeRouter } from "./like";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  post: postRouter,
  like: likeRouter,
  comment: commentRouter,
  user: userRouter,
  newProcedures: publicProcedure.query(() => "Yay!!"),
});

export type AppRouter = typeof appRouter;
