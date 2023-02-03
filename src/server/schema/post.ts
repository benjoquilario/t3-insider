import z, { type TypeOf } from "zod";

export const createPostSchema = z.object({
  id: z.string().optional(),
  name: z.string().nullish(),
  message: z.string(),
  selectedFile: z
    .array(
      z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
        fallbackUrl: z.string(),
      })
    )
    .nullable(),
  postId: z.string().optional(),
});

export const postSchema = z.object({
  cursor: z.number().nullish(),
  limit: z.number().nullable(),
});

export const postIdSchema = postSchema.extend({
  id: z.string().optional(),
});

export type PostSchema = TypeOf<typeof createPostSchema>;
