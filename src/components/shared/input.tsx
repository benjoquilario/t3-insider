import React from "react";
import classNames from "classnames";

type Icon = {
  className?: string;
};

type InputProps = {
  containerClassName?: string;
  labelClassName?: string;
  label?: string;
  Icon?: React.ComponentType<Icon>;
  iconClassName?: string;
  className?: string;
  placeholder?: string;
  children?: React.ReactNode;
} & React.HTMLProps<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    containerClassName,
    labelClassName,
    label,
    Icon,
    iconClassName,
    className,
    children,
    ...inputProps
  } = props;
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={label} className={labelClassName}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={classNames(
          "mb-3 h-[40px] w-full rounded border-none bg-white px-[15px] text-sm font-normal leading-[40px] text-gray-700 outline outline-1 outline-offset-1 outline-zinc-300 focus:outline-2 focus:outline-offset-1 focus:outline-primary focus:ring-0 ",
          className
        )}
        {...inputProps}
      />
      {children}
      {Icon && <Icon className={iconClassName} />}
    </div>
  );
});

Input.displayName = "Input";

export default React.memo(Input);
