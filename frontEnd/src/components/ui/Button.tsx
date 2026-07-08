import { type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        size === "md" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs",
        variant === "primary" &&
          "bg-accent text-ink hover:bg-accent-hover font-semibold",
        variant === "secondary" &&
          "bg-surface-raised text-text border border-border hover:bg-surface-hover",
        variant === "ghost" &&
          "text-text-muted hover:text-text hover:bg-surface-raised",
        variant === "danger" &&
          "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
