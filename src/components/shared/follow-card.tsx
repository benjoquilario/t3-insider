import type { User } from "@/types/types";
import React from "react";
import Image from "./image";
import Link from "next/link";

type FollowCardProps = {
  follow: User;
};

const FollowCard: React.FC<FollowCardProps> = ({ follow }) => {
  return (
    <li>follow card</li>
    // <li className="relative h-16 overflow-hidden rounded-md">
    //   <Link to={`/profile/${follow?.id}`} aria-label={follower?.id}>
    //     <div className="absolute inset-0 flex items-center overflow-hidden rounded-md border border-solid border-gray-700">
    //       <div className="ml-2">
    //         <Image
    //           className="h-10 w-10 rounded-full md:h-11 md:w-11"
    //           src={follow?.image|| '/default-image.png'}
    //           alt={follow?.name || ''}
    //         />
    //       </div>
    //       <div className="ml-2 flex-1">
    //         <h3 className="text-sm font-semibold capitalize leading-tight text-white">
    //           {follow?.name}
    //         </h3>
    //       </div>
    //     </div>
    //   </Link>
    //   {isFollowing ? (
    //     <div className="absolute top-4 right-3 ml-auto flex h-8 w-28 items-center justify-center gap-1 rounded-md bg-[#6a55fa] text-white md:w-20">
    //       <BsFillCheckCircleFill aria-hidden="true" size={15} />
    //       <span className="text-xs">Following</span>
    //     </div>
    //   ) : (
    //     <div className="absolute top-4 right-3">
    //       <Ripples color="#ffffff80">
    //         <button
    //           onClick={() => dispatch(followUser(follower?._id))}
    //           aria-label="follow user"
    //           className="ml-auto flex h-8 h-8 w-28 items-center justify-center gap-1 rounded-md bg-[#6a55fa] text-white md:w-20"
    //         >
    //           <BsFillPersonPlusFill aria-hidden="true" size={15} />
    //           <span className="text-xs">Follow</span>
    //         </button>
    //       </Ripples>
    //     </div>
    //   )}
    // </li>
  );
};

export default FollowCard;
