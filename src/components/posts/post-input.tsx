import React from "react";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import type { PostValues } from "../form/post";
import { HiPhoto } from "react-icons/hi2";
import ImageThumbnail from "../shared/image-thumbnail";
import Image from "../shared/image";
import classNames from "classnames";
import type { SelectedFileType } from "@/types/types";

interface PostInputProps {
  control: Control<PostValues>;
  setValue: UseFormSetValue<PostValues>;
  openFilePicker: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  selectedFile?: SelectedFileType[];
}

const PostInput: React.FC<PostInputProps> = ({
  control,
  setValue,
  openFilePicker,
  children,
  disabled,
  selectedFile,
}) => {
  const selectedImage = useWatch({
    control,
    name: "selectedFile",
    defaultValue: [],
  });

  const removeImage = (imageName: string) => {
    setValue(
      "selectedFile",
      selectedImage.filter((image) => image.name !== imageName)
    );
  };

  return (
    <div className="rounded-b-md bg-white p-3">
      <div
        className={classNames(
          " relative overflow-auto",
          selectedFile?.length || selectedImage.length ? "h-56" : ""
        )}
      >
        {selectedFile?.length
          ? selectedFile?.map((image, index) => (
              <Image
                key={index}
                src={image.url}
                layout="responsive"
                width={image.width}
                height={image.height}
                objectFit="cover"
                className="rounded-lg"
                alt=""
              />
            ))
          : null}
        {selectedImage.length
          ? selectedImage?.map((image, index) => {
              return (
                <ImageThumbnail
                  key={index}
                  image={image}
                  removeImage={removeImage}
                />
              );
            })
          : null}
      </div>

      <div className="flex items-center gap-4 rounded border border-gray-200 py-2 px-2">
        <p className="text-sm text-black md:text-sm">Upload Photo :</p>
        <div className="overflow-hidden rounded-full p-1 text-xs text-white transition hover:bg-zinc-100 md:text-sm">
          <button
            className="flex h-5 w-8 cursor-pointer items-center justify-center text-black"
            onClick={openFilePicker}
            type="button"
            disabled={disabled}
          >
            <HiPhoto className="h-8 w-8" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PostInput;
