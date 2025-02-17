"use client"

import * as React from "react"

import * as LabelPrimitive from "@radix-ui/react-label"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { labelVariants } from "@/lib/variants"

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName
