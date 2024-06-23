"use client"

import React, { useRef, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import TextareaAutoSize from "react-textarea-autosize"
import { IoMdSend } from "react-icons/io"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useCreateCommentMutation } from "@/hooks/useCreateComment"

const commentSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment must be at least 1 character" }),
})

type CommentFormProps = {
  commentId: string
  postId: string
}

const CommentForm = (props: CommentFormProps) => {
  const { commentId, postId } = props
  const form = useForm<z.infer<typeof commentSchema>>({
    defaultValues: {
      comment: "",
    },
  })

  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const { createCommentMutation } = useCreateCommentMutation({ postId })

  useEffect(() => {
    form.setFocus("comment")
  }, [form.setFocus])

  async function handleOnSubmit(data: z.infer<typeof commentSchema>) {
    await createCommentMutation.mutateAsync({
      postId,
      commentText: data.comment,
    })
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset()
    }
  }, [form])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault()
      buttonRef?.current?.click()
      form.reset()
    }
  }

  return (
    <div className="flex flex-row items-center space-x-2">
      <div className="-mt-2">
        <div className="relative">
          <Image
            src={"/default-image.png"}
            alt="profile pic"
            objectFit="cover"
            fill
            className="rounded-full"
          />
        </div>
      </div>
      <div className="grow overflow-hidden">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="relative flex w-full flex-wrap justify-end"
            >
              <div className="relative w-full">
                <div className="flex flex-wrap justify-end">
                  <div className="shrink grow basis-[auto] overflow-hidden pb-2">
                    <div className="relative p-1">
                      <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Comment</FormLabel>
                            <FormControl>
                              <TextareaAutoSize
                                {...field}
                                placeholder="Write a comment..."
                                className={cn(
                                  "relative w-full rounded-lg bg-secondary py-2 pl-3 pr-9 text-sm text-foreground/90 shadow ring-secondary/80 transition",
                                  "hover:ring-secondary-70 hover:text-foreground",
                                  "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-foreground/60 active:text-foreground/70",
                                  "focus:outline-none focus:outline-offset-1 focus:outline-primary focus-visible:outline-offset-2 focus-visible:outline-primary"
                                )}
                                onKeyDown={handleKeyPress}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {commentId && (
                      <div className="absolute left-2 top-[42px] flex gap-1 text-xs text-primary">
                        <button type="button">Cancel</button>
                        <span>Esc</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  ref={buttonRef}
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className="absolute bottom-6 right-4 text-xl text-primary"
                >
                  <IoMdSend />
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default CommentForm
