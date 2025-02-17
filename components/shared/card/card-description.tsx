import * as React from "react"

import { cn } from "@/lib/utils"

export const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-muted-foreground text-sm", className)} {...props} />
))
CardDescription.displayName = "CardDescription"
