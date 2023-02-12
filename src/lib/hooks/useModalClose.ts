/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "@/store/store";
import { setPostOpen } from "@/store/posts/slice";

export const useModalCloser = <T extends >() => {
  const postOpen = useSelector((store) => store.post);
  const ref = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    postOpen && (document.body.style.overflow = "hidden");

    const focusTrap = (event: any) => {
      if (event.key === "Escape") dispatch(setPostOpen(false));
      if (event.key !== "Tab") return;
    };

    document.addEventListener("keydown", focusTrap);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", focusTrap);
    };
  }, [postOpen, dispatch]);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current?.contains(event.target)) {
      dispatch(setPostOpen(false));
    }
  };

  return { handleClickOutside, ref };
};
