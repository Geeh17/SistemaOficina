import { type InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <label className="flex flex-col gap-1.5 text-sm" htmlFor={inputId}>
        {label && <span className="text-text-muted font-medium">{label}</span>}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "bg-surface-raised border border-border rounded-md px-3 py-2 text-text placeholder:text-text-faint",
            "focus:border-accent transition-colors outline-none",
            error && "border-danger",
            className
          )}
          {...props}
        />
        {error && <span className="text-danger text-xs">{error}</span>}
      </label>
    );
  }
);
Input.displayName = "Input";
