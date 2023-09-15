import z from "zod"

export const commentIdSchema = z.object({
  id: z.string().optional(),
})

export const createCommentSchema = commentIdSchema.extend({
  comment: z.string(),
  postId: z.string().optional(),
  commentId: z.string().optional(),
})

export const commentSchema = z.object({
  postId: z.string().optional(),
  cursor: z.number().nullish(),
  limit: z.number().nullable(),
  commentId: z.string().optional(),
})
