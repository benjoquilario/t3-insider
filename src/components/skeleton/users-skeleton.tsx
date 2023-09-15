import React from "react"

const UsersSkeleton = () => {
  return (
    <li className="h-16 w-auto space-y-3 rounded bg-white shadow">
      <div className="flex animate-pulse items-center justify-center gap-2 px-3 py-2">
        <div className="h-12 w-12 rounded-full bg-zinc-100"></div>
        <div className="ml-1 flex-auto space-y-2">
          <div className="h-4 w-3/4 rounded bg-zinc-100"></div>
          <div className="h-3 w-2/4 rounded bg-zinc-100"></div>
        </div>
        <div className="h-[32px] w-[32px] rounded bg-zinc-100"></div>
      </div>
    </li>
  )
}

export default UsersSkeleton
