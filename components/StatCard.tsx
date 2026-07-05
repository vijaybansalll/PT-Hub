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
  iconColor = "text-neutral-500",
  subtitleColor = "text-neutral-400",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-250 bg-white text-neutral-950 shadow-xs p-4 md:p-6 flex flex-col transition-all hover:shadow-sm duration-200">
      <div className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
        <span className="text-xs font-semibold tracking-tight text-neutral-500">
          {title}
        </span>
        <div className={cn("text-neutral-450", iconColor)}>{icon}</div>
      </div>
      <div className="mt-1">
        <div className="text-2xl font-bold tracking-tight text-neutral-900">
          {value}
        </div>
        <p
          className={cn(
            "text-[10px] text-neutral-400 font-semibold mt-1",
            subtitleColor,
          )}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
