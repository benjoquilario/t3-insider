import { AiFillCamera } from "react-icons/ai";
import { RiCloseFill } from "react-icons/ri";
import useProfileDropZone from "@/lib/hooks/useProfileZone";
import { useForm, type SubmitHandler } from "react-hook-form";
import { uploadPicture } from "@/lib/utils/cloudinary";
import { trpc } from "@/lib/utils/trpc";
import { toast } from "react-toastify";
import classNames from "classnames";
import Image from "@/components/shared/image";
import Button from "@/components/shared/button";
import Backdrop from "@/components/shared/backdrop";
import Loader from "@/components/shared/loader";
import React, { useMemo, useEffect } from "react";

type ProfilePhotoProps = {
  image?: string;
  userId: string;
};

interface ProfileValues {
  images: File[];
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ image, userId }) => {
  const utils = trpc.useContext();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<ProfileValues>({
    defaultValues: {
      images: [],
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [reset, isSubmitSuccessful]);

  const draftImageFile = watch("images")[0];

  const draftImage = useMemo(
    () => (draftImageFile ? URL.createObjectURL(draftImageFile) : null),
    [draftImageFile]
  );

  const { mutateAsync, isLoading } = trpc.user.uploadPhoto.useMutation({
    onError: (e) => console.log(e.message),
    onSuccess: async () => {
      toast("Your post was updated successfully", {
        type: "success",
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      await utils.user.getUsers.invalidate();
      await utils.post.getPostsById.invalidate({ id: userId, limit: 3 });
      await utils.user.authUser.invalidate();
      await utils.user.getUserById.invalidate({ id: userId });
    },
  });

  const handleOnSubmit: SubmitHandler<ProfileValues> = async (data) => {
    const imageUrl = await uploadPicture(data.images[0] as File);

    await mutateAsync({
      image: imageUrl?.url,
    });
  };

  const setImage = (file: File[]) => {
    setValue("images", file);
  };

  const {
    isDragActive: isImageDragged,
    getInputProps: getInputProps,
    getRootProps: getRootImageProps,
    open: openImage,
  } = useProfileDropZone(setImage);

  return (
    <React.Fragment>
      {draftImageFile ? (
        <Backdrop>
          <div className="z-20 m-4 h-auto w-full max-w-screen-md rounded-md bg-white shadow-md md:w-2/4">
            <div className="flex items-center justify-between p-2">
              <h3 className="p-2 text-base text-black md:text-lg">
                Update profile picture
              </h3>

              <Button
                className="rounded-full bg-[#edf1f5] p-2 text-zinc-700 transition duration-75 ease-in hover:bg-[#e5e8eb]"
                aria-label="close modal"
                // onClick={() => handleOnReset()}
              >
                <RiCloseFill aria-hidden="true" size={25} />
              </Button>
            </div>
            <div
              className={classNames(
                "relative mt-2",
                isImageDragged && "outline-dashed outline-blue-500"
              )}
              {...getRootImageProps()}
            >
              <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div className="flex flex-col items-center">
                  <div className="overflow-hidden rounded-md border border-zinc-200 p-2">
                    <Image
                      src={draftImage || "/"}
                      alt=""
                      objectFit="cover"
                      layout="fill"
                      containerclassnames="relative h-72 w-56"
                    />
                    <div className="mt-3 flex justify-end gap-2">
                      {isLoading ? (
                        <Loader
                          classNameContainer="text-zinc-900"
                          classNameIcon="h-8 w-8 animate-spin"
                        />
                      ) : (
                        <React.Fragment>
                          <Button
                            type="button"
                            className="flex h-8 w-20 items-center justify-center rounded-md font-semibold text-primary transition hover:bg-zinc-100"
                            aria-label="Close upload modal"
                            onClick={() => reset()}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex h-8 w-20 items-center justify-center rounded-md bg-primary p-2 text-white transition duration-75 ease-in hover:bg-[#8371f8]"
                            aria-label="Save upload profile"
                            type="submit"
                          >
                            Save
                          </Button>
                        </React.Fragment>
                      )}
                    </div>
                  </div>

                  <input {...getInputProps()} />
                  <input
                    {...register("images")}
                    type="file"
                    className="hidden"
                  />
                </div>
              </form>
            </div>
          </div>
        </Backdrop>
      ) : null}
      <div className="relative -mt-20 flex-shrink-0" {...getRootImageProps}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="h-[114px] w-[114px] rounded-full">
            <Image
              className="relative rounded-full border-4 border-zinc-800 bg-gray-900"
              src={image || "/default-image.png"}
              alt=""
              objectFit="cover"
              layout="fill"
              containerclassnames="relative h-28 w-28"
            />
          </div>

          <Button
            type="button"
            onClick={openImage}
            className={classNames(
              "absolute right-0 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-md",
              " hover:bg-zinc-50 hover:text-secondary active:scale-110",
              "focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-zinc-200 active:text-secondary"
            )}
          >
            <AiFillCamera size={20} />
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default ProfilePhoto;
