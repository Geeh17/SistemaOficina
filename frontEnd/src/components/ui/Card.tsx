import { type HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "bg-surface border border-border-soft rounded-lg",
        className
      )}
      {...props}
    />
  );
}
