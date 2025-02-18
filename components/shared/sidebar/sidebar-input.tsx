import * as React from "react"

import { cn } from "@/lib/utils"

import { Input } from "@/components/shared/"

export const SidebarInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "focus-visible:ring-sidebar-ring h-8 w-full bg-background shadow-none focus-visible:ring-2",
        className,
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"
