import React, { useRef, useEffect } from "react";
import Button from "../shared/button";
import { RiCloseFill } from "react-icons/ri";
import Backdrop from "../shared/backdrop";
import useClickOutside from "hooks/useClickOutside";

type ModalDeleteProps = {
  handleDelete: () => void;
  type: string;
  isModalOpen: boolean;
  setIsModalOpen: (arg: boolean) => void;
};

const ModalDelete: React.FC<ModalDeleteProps> = ({
  handleDelete,
  type,
  isModalOpen,
  setIsModalOpen,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useClickOutside(ref, () => setIsModalOpen(false));

  useEffect(() => {
    isModalOpen && (document.body.style.overflow = "hidden");

    const focusTrap = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
      if (event.key !== "Tab") return;
    };

    document.addEventListener("keydown", focusTrap);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", focusTrap);
    };
  }, [isModalOpen, setIsModalOpen]);

  return (
    <Backdrop>
      <div
        ref={ref}
        className="z-20 m-4 h-auto w-full max-w-2xl rounded-md bg-white shadow-md md:w-2/4"
      >
        <div className="relative flex w-full flex-col items-center justify-center p-4">
          <h3 className="pt-2 pb-4 text-center text-base font-semibold text-black md:text-lg">
            Delete {type}?
          </h3>
          <div className="flex w-full flex-col gap-2 border-t border-zinc-300 pt-2">
            <p>Are you sure you want to delete this {type}?</p>
            <div className="flex gap-2 self-end">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-md font-semibold text-primary transition hover:bg-zinc-100"
                aria-label="Close Delete Modal"
              >
                No
              </Button>
              <Button
                className="flex h-10 w-20 items-center justify-center rounded-md bg-primary p-2 text-white transition duration-75 ease-in hover:bg-[#8371f8]"
                aria-label="Delete"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
          <Button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-2 right-4 rounded-full bg-[#edf1f5] p-2 text-zinc-700 transition duration-75 ease-in hover:bg-[#e5e8eb]"
          >
            <RiCloseFill aria-hidden="true" size={25} />
          </Button>
        </div>
      </div>
    </Backdrop>
  );
};

export default ModalDelete;
