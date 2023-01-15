import { registerSchema } from "@/server/schema/auth";
import { TRPCError } from "@trpc/server";
import bcrpyt from "bcryptjs";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const { firstName, lastName, email, password, confirmPassword } = input;
      const isEmailExist = await ctx.prisma.user.findFirst({
        where: { email },
      });

      const hashedPassword = bcrpyt.hashSync(password);

      if (isEmailExist)
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });

      if (password !== confirmPassword)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Password and Confirm Password must match",
        });

      const result = await ctx.prisma.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          password: hashedPassword,
        },
      });

      return {
        status: 201,
        message: "Account create successfully",
        result: result.email,
      };
    }),
});
