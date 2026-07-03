import React from "react";
import { cn } from "@/app/utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  subtitleColor?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  borderColor,
  iconBg,
  iconColor,
  subtitleColor = "text-zinc-400"
}: StatCardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-l-4",
      borderColor
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-550 text-xs font-bold">{title}</span>
        <div className={cn("p-2 rounded-lg", iconBg, iconColor)}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight text-zinc-900">{value}</div>
      <p className={cn("text-[10px] mt-1 font-medium", subtitleColor)}>{subtitle}</p>
    </div>
  );
}
