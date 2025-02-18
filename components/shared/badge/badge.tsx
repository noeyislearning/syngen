import * as React from "react"

import { cn } from "@/lib/utils"
import { badgeVariants } from "@/lib/variants"
import { BadgeProps } from "@/lib/types"

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
