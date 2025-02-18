import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { type VariantProps } from "class-variance-authority"

import { buttonVariants, sheetVariants } from "@/lib/variants"

/**
 * Button
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
/**
 * Sidebar
 */
export interface SidebarContext {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}
/**
 * Sheet
 */
export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}
