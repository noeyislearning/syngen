"use client"

import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/shared/"
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
        <div className="text-muted-foreground">
          Phone:
          <span className="ml-1 underline underline-offset-2">{message.phoneNumber}</span>
        </div>
      </div>
    </div>
  )
}
