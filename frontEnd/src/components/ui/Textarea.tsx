import { type TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const areaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <label className="flex flex-col gap-1.5 text-sm" htmlFor={areaId}>
        {label && <span className="text-text-muted font-medium">{label}</span>}
        <textarea
          ref={ref}
          id={areaId}
          className={clsx(
            "bg-surface-raised border border-border rounded-md px-3 py-2 text-text placeholder:text-text-faint resize-none",
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
Textarea.displayName = "Textarea";
