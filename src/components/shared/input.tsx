import React from "react";
import classNames from "classnames";
import { Field } from "formik";

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
} & React.HTMLProps<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    containerClassName,
    labelClassName,
    label,
    Icon,
    iconClassName,
    className,
    ...inputProps
  } = props;
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={label} className={labelClassName}>
          {label}
        </label>
      )}
      <Field
        ref={ref}
        className={classNames(
          "h-[40px] w-full rounded bg-white px-[15px] text-sm font-normal leading-[40px] text-gray-700 outline-none",
          className
        )}
        {...inputProps}
      />
      {Icon && <Icon className={iconClassName} />}
    </div>
  );
});

Input.displayName = "Input";

export default React.memo(Input);
