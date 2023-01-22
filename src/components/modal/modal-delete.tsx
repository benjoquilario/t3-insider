import React from "react";
import Button from "../shared/button";
import { RiCloseFill } from "react-icons/ri";

const ModalDelete = () => {
  return (
    <div className="z-20 m-4 h-auto w-full max-w-screen-md rounded-md bg-white shadow-md md:w-2/4">
      <div className="relative flex items-center justify-center border-b border-gray-200 p-2">
        <h3 className="p-2 text-center text-base text-black md:text-lg">
          Delete Post
        </h3>

        <Button
          className="absolute right-4 top-3 rounded-full p-2 text-gray-700 transition duration-75 ease-in hover:bg-[#edf1f5]"
          aria-label="close modal"
          // onClick={() => handleOnReset()}
        >
          <RiCloseFill aria-hidden="true" size={25} />
        </Button>
      </div>
    </div>
  );
};

export default ModalDelete;
