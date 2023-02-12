export const capitalizeName = (name: string) => {
  if (name) {
    const names = name.split(" ");
    const namesUpper = [];

    for (const name of names) {
      namesUpper.push(
        name.replace(name[0] as string, name[0]?.toUpperCase() as string)
      );
    }

    return namesUpper.join(" ");
  }
};

export const getImageWidthRatio = (imageNumber: number, imageIndex: number) => {
  if (imageNumber === 1) {
    return 100;
  }
  if (imageNumber === 2) {
    return 110;
  }
  if (imageNumber === 3) {
    if (imageIndex === 0) {
      return 50;
    }
    return 50;
  }
  return 100;
};

export const getImageHeightRatio = (
  imageNumber: number,
  imageIndex: number
) => {
  if (imageNumber === 1) {
    return 80;
  }
  if (imageNumber === 2) {
    return 130;
  }
  if (imageNumber === 3) {
    if (imageIndex === 0) {
      return 40;
    }
    return 44;
  }
  return 110;
};

export const intitialState = {
  message: "",
  selectedFile: "",
  name: "",
  id: "",
};

export const backdropVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

export const formVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};
