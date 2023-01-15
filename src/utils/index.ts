import type { CloudinaryType } from "@/types/types";

export const uploadPicture = async (currentFile: File) => {
  try {
    const formData = new FormData();
    formData.append("file", currentFile);
    formData.append("upload_preset", "social_media_insider");

    const url = process.env.CLOUDINARY_URL as string;
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const cloudinaryData = (await res.json()) as CloudinaryType;

    return cloudinaryData?.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export const intitialState = {
  message: "",
  selectedFile: "",
  name: "",
};

export const backdropVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export const modalVariant = {
  hidden: {
    y: "-10%",
    transition: { type: "spring", ease: "easeOut", duration: 0.3 },
  },
  visible: {
    y: 0,
    transition: { type: "spring", ease: "easeOut", duration: 0.3 },
  },
};

export const formVariant = {};
