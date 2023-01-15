import { createTRPCRouter, publicProcedure } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { postRouter } from "./post";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  post: postRouter,
  newProcedures: publicProcedure.query(() => "Yay!!"),
});

// export type definition of API
export type AppRouter = typeof appRouter;
