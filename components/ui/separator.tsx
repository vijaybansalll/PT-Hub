import * as React from "react"
import { cn } from "@/lib/utils"

function Separator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="separator"
      className={cn("h-px w-full bg-neutral-200 dark:bg-neutral-800", className)}
      {...props}
    />
  )
}

export { Separator }
