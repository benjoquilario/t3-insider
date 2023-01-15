import z, { type TypeOf } from "zod";

export const createPostSchema = z.object({
  name: z.string().nullish(),
  message: z.string(),
  selectedFile: z.string().nullable(),
});

export const postSchema = z.object({
  cursor: z.number().nullish(),
  limit: z.number().nullable(),
});

export type PostSchema = TypeOf<typeof createPostSchema>;
