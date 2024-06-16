"use client"

import React from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { AiFillCamera } from "react-icons/ai"
import { RiCloseFill } from "react-icons/ri"

const ProfilePhoto = () => {
  return (
    <React.Fragment>
      {/* {draftImageFile ? (
        <Backdrop> */}
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
      </div>
      {/* </Backdrop>
      ) : null} */}
      <div className="relative -mt-20 flex-shrink-0">
        <form>
          <div className="h-[114px] w-[114px] rounded-full">
            <Image
              className="relative rounded-full border-4 border-zinc-800 bg-gray-900"
              src={"/default-image.png"}
              alt=""
              objectFit="cover"
              layout="fill"
            />
          </div>

          <Button
            type="button"
            // onClick={openImage}
            className={cn(
              "absolute bottom-3 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-md",
              "hover:bg-zinc-50 hover:text-secondary active:scale-110",
              "focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-zinc-200 active:text-secondary"
            )}
          >
            <AiFillCamera size={20} />
          </Button>
        </form>
      </div>
    </React.Fragment>
  )
}

export default ProfilePhoto

{
  /* <div className="">
          <form>
            <div className="flex flex-col items-center">
              <div className="overflow-hidden rounded-md border border-zinc-200 p-2">
                <Image
                  src={"/"}
                  alt=""
                  objectFit="cover"
                  layout="fill"
                  // containerclassnames="relative h-72 w-56"
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
                      // onClick={() => reset()}
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

              <input />
              <input type="file" className="hidden" />
            </div>
          </form>
        </div> */
}
