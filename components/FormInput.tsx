import React from "react";
import { cn } from "@/app/utils/cn";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  span?: string;
}

export default function FormInput({
  label,
  icon,
  span = "",
  className,
  ...props
}: FormInputProps) {
  return (
    <div className={cn("space-y-1.5", span)}>
      <label className="text-xs font-semibold tracking-tight text-zinc-500">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
            {icon}
          </span>
        )}
        <input
          className={cn(
            "flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:opacity-50 disabled:pointer-events-none",
            icon && "pl-8",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}
