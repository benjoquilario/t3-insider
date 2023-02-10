import React from "react";

const UserSkeleton = () => {
  return (
    <div className="mb-2 w-auto space-y-3 rounded">
      <div className="flex animate-pulse items-center justify-center gap-2 px-4 py-5">
        <div className="h-12 w-12 rounded-full bg-zinc-100"></div>
        <div className="flex-auto space-y-2">
          <div className="h-6 w-3/4 rounded-full bg-zinc-100"></div>
          <div className="h-3 w-2/4 rounded-full bg-zinc-100"></div>
        </div>
      </div>
    </div>
  );
};

export default UserSkeleton;
