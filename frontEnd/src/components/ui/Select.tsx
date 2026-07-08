import { type SelectHTMLAttributes, forwardRef, type ReactNode } from "react";
import clsx from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <label className="flex flex-col gap-1.5 text-sm" htmlFor={selectId}>
        {label && <span className="text-text-muted font-medium">{label}</span>}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            "bg-surface-raised border border-border rounded-md px-3 py-2 text-text",
            "focus:border-accent transition-colors outline-none",
            error && "border-danger",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-danger text-xs">{error}</span>}
      </label>
    );
  }
);
Select.displayName = "Select";
