import * as React from "react"

import { cn } from "@/lib/utils"

import { Separator } from "@/components/shared/"

export const SidebarSeparator = React.forwardRef<
  React.ComponentRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"
