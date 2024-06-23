import * as z from "zod"

export const credentialsValidator = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(4, {
    message: "Password is required",
  }),
})

export const registerValidator = credentialsValidator
  .extend({
    firstName: z.string().min(4),
    lastName: z.string().min(4),
    confirmPassword: z.string().min(4, {
      message: "Password must be at least 4 character",
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      })
    }
  })

export type IRegister = z.infer<typeof registerValidator>
export type ICredentials = z.infer<typeof credentialsValidator>
