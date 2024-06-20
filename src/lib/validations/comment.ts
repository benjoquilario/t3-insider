import * as z from "zod"

export const commentValidator = z.object({
  comment: z.string().min(1, {
    message: "Comment must atleast 1 character",
  }),
})
