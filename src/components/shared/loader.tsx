import React from "react";
import { ImSpinner8 } from "react-icons/im";

type LoaderProps = {
  classNameContainer: string;
  classNameIcon: string;
};

const Loader: React.FC<LoaderProps> = ({
  classNameContainer,
  classNameIcon,
}) => {
  return (
    <div className={classNameContainer}>
      <ImSpinner8 className={classNameIcon} />
    </div>
  );
};

export default Loader;
