import { useDropzone } from "react-dropzone";
import type { PostValues } from "@/components/form/post";
import { useForm } from "react-hook-form";
import { useState, useMemo, useCallback } from "react";

const usePost = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    control,
    setFocus,
    formState: { isSubmitSuccessful },
  } = useForm<PostValues>({
    defaultValues: {
      message: "",
      selectedFile: [],
      imageUploadProgress: [],
    },
  });
  const [isUploading, setIsUploading] = useState(false);

  const setImages = useCallback(
    (files: File[]) => {
      const currentImages = getValues("selectedFile");

      if (files?.length + currentImages?.length > 4) {
        return;
      }

      const imageToVerify = files.slice(0, 4 - currentImages?.length);

      setValue("selectedFile", [
        ...getValues("selectedFile"),
        ...imageToVerify,
      ]);
    },
    [getValues, setValue]
  );

  const selectedImages = watch("selectedFile");

  const {
    getRootProps,
    getInputProps,
    isDragActive: isImageDragged,
    open: openFilePicker,
  } = useDropzone({
    noClick: true,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
    onDrop: (files: File[]) => {
      setImages(files);
      setValue(
        "imageUploadProgress",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Array(selectedImages?.length + files.length).fill(0)
      );
    },
    disabled: isUploading,
    validator: (file: File) => {
      if (getValues("selectedFile").some((image) => image.name === file.name)) {
        return {
          code: "file-exists",
          message: `File with name ${file.name} was added already`,
        };
      }
      return null;
    },
  });

  const sumOfCurrentUploaded = watch("imageUploadProgress")?.reduce(
    (sum, entry) => sum + entry,
    0
  );

  const finalUploadProgress =
    sumOfCurrentUploaded / selectedImages?.length || 0;

  return {
    getRootProps,
    getInputProps,
    finalUploadProgress,
    isImageDragged,
    openFilePicker,
    handleSubmit,
    isSubmitSuccessful,
    register,
    reset,
    watch,
    control,
    setValue,
    getValues,
    setFocus,
    isUploading,
    setIsUploading,
  };
};

export default usePost;
