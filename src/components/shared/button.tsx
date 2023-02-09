import React from "react";

export type ButtonProps = {
  type?: "button" | "submit" | "reset";
  className?: string;
  children?: React.ReactNode;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null
  ) => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      type,
      className,
      children,
      onClick,
      disabled = false,
      ...buttonProps
    } = props;
    return (
      <button
        onClick={(e) => {
          if (disabled) return;

          onClick?.(e);
        }}
        ref={ref}
        type={type}
        className={className}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default React.memo(Button);
