import * as z from "zod"

export const postValidator = z.object({
  content: z.string().min(1, {
    message: "Content must atleast 1 character",
  }),
  selectedFile: z.instanceof(File),
})

export type IPost = z.infer<typeof postValidator>
