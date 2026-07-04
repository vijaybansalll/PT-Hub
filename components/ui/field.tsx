import * as React from "react"
import { cn } from "@/lib/utils"

function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-1.5 w-full", className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      data-slot="field-label"
      className={cn("text-xs font-semibold tracking-tight text-zinc-500", className)}
      {...props}
    />
  )
}

interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  errors?: (any | string | null | undefined)[]
}

function FieldError({
  className,
  errors = [],
  ...props
}: FieldErrorProps) {
  const firstError = errors.filter(Boolean)[0]
  if (!firstError) return null
  
  const message = typeof firstError === "string" ? firstError : firstError.message
  if (!message) return null

  return (
    <p
      data-slot="field-error"
      className={cn("text-xs font-medium text-red-500", className)}
      {...props}
    >
      {message}
    </p>
  )
}

export { Field, FieldLabel, FieldError }
