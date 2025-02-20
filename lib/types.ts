import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { type VariantProps } from "class-variance-authority"
import { FieldPath, FieldValues } from "react-hook-form"

import { buttonVariants, sheetVariants, badgeVariants } from "@/lib/variants"

/**
 * Badge
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
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
export interface SidebarContextProps {
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
/**
 * Authentication Forms
 */
export interface AuthFormProps {
  handleToggleSignUp: () => void
  loading?: boolean
}
/**
 * Form Field
 */
export interface FormFieldContextProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
}
export interface FormItemContextProps {
  id: string
}
/**
 * User
 */
export interface UserProps {
  userId: string
  phoneNumber: string
  email?: string
}
export interface UserContextProps {
  user: UserProps | null
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  login: (userData: UserProps) => void
  logout: () => void
}
export interface UserProviderProps {
  children: React.ReactNode
}
/**
 * Messages
 */
export interface IAttachment {
  // Interface for Attachments
  filename: string
  fileUrl: string
  fileType?: string
}

export interface MessageDetailProps {
  id: string
  messageType: string
  name: string
  subject: string | null
  text: string
  date: string
  isSender: boolean
  attachments?: IAttachment[]
}
export interface MessageTypeProps {
  userId: string
  from: string
  email: string
  phoneNumber: string
  messages: MessageDetailProps[]
}
export interface SendMessageRequestPayloadProps extends Record<string, unknown> {
  receiverId: string
  messageType: string
  text: string
  subject?: string
}
