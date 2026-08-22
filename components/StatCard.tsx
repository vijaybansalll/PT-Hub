import React from "react";
import { cn } from "@/app/utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  borderColor?: string;
  iconBg?: string;
  iconColor?: string;
  subtitleColor?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = "text-neutral-400",
  subtitleColor = "text-neutral-400",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200/50 bg-white p-4.5 flex flex-col justify-between transition-all duration-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
      <div className="flex flex-row items-center justify-between space-y-0">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          {title}
        </span>
        <div className={cn("shrink-0", iconColor)}>
          {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
        </div>
      </div>
      <div className="mt-2.5">
        <div className="text-2xl font-semibold tracking-tight text-neutral-900 leading-none">
          {value}
        </div>
        <p className={cn("text-[11px] mt-2 font-normal leading-none", subtitleColor)}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
