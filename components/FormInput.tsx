import React from "react";
import { cn } from "@/app/utils/cn";
import { Input } from "@/components/ui/input";

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
    <div className={cn("space-y-1.5 flex flex-col", span)}>
      <label className="text-xs font-semibold tracking-tight text-neutral-500">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 text-sm">
            {icon}
          </span>
        )}
        <Input className={cn(icon && "pl-8", className)} {...props} />
      </div>
    </div>
  );
}
