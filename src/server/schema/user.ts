import z from "zod";

export const userIdSchema = z.object({
  id: z.string(),
});

export const userSchema = z.object({
  cursor: z.number().nullish(),
  limit: z.number().nullable(),
});

export const userProfileSchema = z.object({
  image: z.string().optional(),
  coverPhoto: z.string().optional(),
});
