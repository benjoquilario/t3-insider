import { useEffect, type RefObject } from "react"

type Event = MouseEvent | TouchEvent | KeyboardEvent

function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: (event: Event) => void
) {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node) || null) {
        return
      }

      callback?.(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, callback])
}

export default useClickOutside
