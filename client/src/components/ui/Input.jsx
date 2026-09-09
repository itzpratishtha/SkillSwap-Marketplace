import clsx from "clsx";
import { forwardRef } from "react";

const Input = forwardRef(
  ({ type = "text", className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={clsx(
          "w-full rounded-xl border border-slate-300 px-4 py-3",
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-emerald-500",
          "focus:border-emerald-500",
          "transition",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;