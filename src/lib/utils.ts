import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalizeName = function (name: string) {
  const arrName = name.split(" ")

  for (let i = 0; i < arrName.length; i++) {
    arrName[i] = arrName[i][0].toUpperCase() + arrName[i].substr(1)
  }

  return arrName.join(" ")
}

export const getImageWidthRatio = (imageNumber: number, imageIndex: number) => {
  if (imageNumber === 1) {
    return 600
  }
  if (imageNumber === 2) {
    return 110
  }
  if (imageNumber === 3) {
    if (imageIndex === 0) {
      return 50
    }
    return 50
  }
  return 100
}

export const getImageHeightRatio = (
  imageNumber: number,
  imageIndex: number
) => {
  if (imageNumber === 1) {
    return 80
  }
  if (imageNumber === 2) {
    return 130
  }
  if (imageNumber === 3) {
    if (imageIndex === 0) {
      return 40
    }
    return 44
  }
  return 110
}
