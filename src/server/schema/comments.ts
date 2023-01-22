import z from "zod";

export const commentIdSchema = z.object({
  id: z.string().optional(),
});

export const createCommentSchema = commentIdSchema.extend({
  comment: z.string(),
  postId: z.string(),
});

export const commentSchema = z.object({
  postId: z.string(),
  cursor: z.number().nullish(),
  limit: z.number().nullable(),
});
