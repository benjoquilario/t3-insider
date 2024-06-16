"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AiFillCamera } from "react-icons/ai"
import { cn } from "@/lib/utils"

const CoverPhoto = () => {
  return (
    <div
      className="relative h-56 w-full overflow-hidden bg-white shadow"
      // {...getRootCoverProps}
    >
      <form>
        <div className="h-full w-full">
          <Image
            src={"/cover.svg"}
            alt="profile"
            layout="fill"
            objectFit="cover"
            // containerclassnames="h-56 w-full relative"
          />
          {/* {draftCoverFile ? ( */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1">
            <Button
              // onClick={() => reset()}
              type="button"
              className="flex h-8 w-20 items-center justify-center rounded-md bg-white text-primary transition hover:bg-zinc-100"
              aria-label="Close upload modal"
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
          </div>

          <Button
            // onClick={openCover}
            type="button"
            className={cn(
              "absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center gap-1 rounded-full bg-white px-1 shadow-md md:w-32 md:rounded-md",
              "hover:bg-zinc-100 active:scale-110",
              "focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-zinc-200 active:text-secondary"
            )}
          >
            <AiFillCamera size={20} />
            <span className="hidden text-xs md:block">Edit cover photo</span>
          </Button>

          <input />
          <input type="file" className="hidden" />
        </div>
      </form>
    </div>
  )
}

export default CoverPhoto
