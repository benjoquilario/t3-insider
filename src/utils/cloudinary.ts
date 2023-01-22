import type { CloudinaryType } from "@/types/types";
import { env } from "@/env/client.mjs";
import axios from "axios";

export const uploadPicture = async (
  currentFile: File,
  uploadProgressCallback?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append("file", currentFile);
  formData.append("upload_preset", "social_media_insider");

  const CLOUDINARY_URL = env.NEXT_PUBLIC_CLOUDINARY_URL;
  const request = await axios.post<CloudinaryType>(CLOUDINARY_URL, formData, {
    onUploadProgress: (progressEvent) => {
      const percentageProgress =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (progressEvent.loaded / progressEvent?.total) * 100;

      if (uploadProgressCallback) {
        uploadProgressCallback(percentageProgress);
      }
    },
  });

  return {
    url: request.data.secure_url,
    fallbackUrl: request.data.secure_url,
    width: request.data.width,
    height: request.data.height,
  };
};
