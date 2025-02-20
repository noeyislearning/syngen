"use client"

import * as React from "react"
import {
  Avatar,
  AvatarFallback,
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shared/"
import { MessageTypeProps } from "@/lib/types"

interface ContactInfoProps {
  message: MessageTypeProps
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ message }) => {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Avatar>
        <AvatarFallback className="uppercase">
          {message.from
            .split(" ")
            .map((chunk) => chunk[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="grid">
        <div className="font-semibold">{message.from}</div>
        <Sheet>
          <SheetTrigger asChild>
            <div className="text-muted-foreground">
              Phone:
              <span className="ml-1 cursor-pointer hover:underline">{message.phoneNumber}</span>
            </div>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Contact Details</SheetTitle>
              <SheetDescription>View contact information and options.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <p className="font-semibold">Name</p>
                <p>{message.from}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <p className="font-semibold">Phone Number</p>
                <p>{message.phoneNumber}</p>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="default">
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
