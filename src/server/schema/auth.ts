import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const registerSchema = loginSchema.extend({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  confirmPassword: z.string().min(4),
});
