import React from "react"

const ProfileSkeleton = () => {
  return (
    <div className="w-full animate-pulse rounded-md bg-white">
      <div className="relative h-56 w-full rounded-t bg-white opacity-80">
        <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-zinc-100"></div>
      </div>
      <div className="z-10 flex flex-col items-center justify-center gap-3 rounded-b-md bg-white p-6 px-4 pt-2 sm:flex-row sm:justify-start">
        <div className="relative -mt-20 ">
          <div className="h-28 w-28 rounded-full bg-zinc-100"></div>
        </div>
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-zinc-100"></div>
            <div className="m-auto h-4 w-36 rounded bg-zinc-100 sm:m-0"></div>
            <div className="m-auto h-3 w-32 rounded bg-zinc-100 sm:m-0"></div>
          </div>
          <div className="mt-2 h-5 w-28 rounded bg-zinc-100 md:mt-0"></div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSkeleton
