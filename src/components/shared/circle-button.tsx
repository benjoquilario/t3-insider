import classNames from "classnames";
import React from "react";
import Button, { type ButtonProps } from "@/components/shared/button";

export interface CircleButtonProps extends ButtonProps {
  secondary?: boolean;
}

const CircleButton = React.forwardRef<HTMLButtonElement, CircleButtonProps>(
  (props, ref) => {
    const { children, className, secondary, ...rest } = props;

    return (
      <Button
        className={classNames("rounded-full p-2", className)}
        type="button"
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

CircleButton.displayName = "CircleButton";

export default CircleButton;
