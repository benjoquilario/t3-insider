import React, { useRef } from "react";
import TextareaAutoSize from "react-textarea-autosize";
import classNames from "classnames";
import type { UseFormRegister, UseFormReset } from "react-hook-form";
import { IoMdSend } from "react-icons/io";
import Image from "./image";
import { useAuthQuery } from "@/lib/hooks/useQuery";

type CommentFormProps = {
  register: UseFormRegister<{ comment: string }>;
  commentId: string;
  commentText: string;
  handleCancel: () => void;
  reset: UseFormReset<{ comment: string }>;
} & React.HTMLProps<HTMLFormElement>;

const CommentForm = React.forwardRef<HTMLFormElement, CommentFormProps>(
  (props, ref) => {
    const {
      register,
      commentId,
      commentText,
      reset,
      handleCancel,
      ...formProps
    } = props;
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const { data: authUser } = useAuthQuery();

    const handleKeyPress = (
      event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      if (event.key === "Enter" && event.shiftKey === false) {
        event.preventDefault();
        buttonRef?.current?.click();
        reset();
      }
    };

    return (
      <div className="flex flex-row items-center space-x-2">
        <div className="-mt-2">
          <Image
            src={authUser?.image || "/default-image.png"}
            alt="profile pic"
            objectFit="cover"
            layout="fill"
            className="rounded-full"
            containerclassnames="relative h-11 w-11"
          />
        </div>
        <div className="grow overflow-hidden">
          <div>
            <form
              {...formProps}
              ref={ref}
              className="relative flex w-full flex-wrap justify-end"
            >
              <div className="relative w-full">
                <div className="flex flex-wrap justify-end">
                  <div className="shrink grow basis-[auto] overflow-hidden pb-2">
                    <div className="relative p-1">
                      <TextareaAutoSize
                        placeholder="Write a comment..."
                        {...register("comment", { required: true })}
                        className={classNames(
                          "relative w-full rounded-full bg-zinc-100 py-2 pl-3 pr-9 text-sm text-zinc-800 shadow ring-zinc-200 transition",
                          "hover:text-zinc-900 hover:ring-zinc-300 ",
                          "focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-zinc-600 active:text-zinc-700",
                          "focus:outline-none focus:outline-offset-1 focus:outline-primary focus-visible:outline-offset-2 focus-visible:outline-primary"
                        )}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                    {commentId && (
                      <div className="absolute top-[42px] left-2 flex gap-1 text-xs text-primary">
                        <button type="button" onClick={handleCancel}>
                          Cancel
                        </button>
                        <span>Esc</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  disabled={commentText?.trim().length === 0}
                  ref={buttonRef}
                  type="submit"
                  className="absolute bottom-6 right-4 text-xl text-primary"
                >
                  <IoMdSend />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
);

CommentForm.displayName = "CommentForm";

export default CommentForm;
