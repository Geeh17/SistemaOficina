import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative w-full sm:w-72">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
      <input
        className="w-full bg-surface-raised border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent outline-none transition-colors"
        {...props}
      />
    </div>
  );
}
