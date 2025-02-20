"use client"

import * as React from "react"
import { MessageSquare, Mail, Phone } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/"

interface MessageFilterProps {
  messageFilter: string
  setMessageFilter: React.Dispatch<React.SetStateAction<string>>
}

export const MessageFilter: React.FC<MessageFilterProps> = ({
  messageFilter,
  setMessageFilter,
}) => {
  return (
    <Select onValueChange={setMessageFilter} value={messageFilter}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Message Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="chat">
            <div className="flex flex-row items-center gap-2 [&>svg]:size-4">
              <MessageSquare />
              Chat
            </div>
          </SelectItem>
          <SelectItem value="email">
            <div className="flex flex-row items-center gap-2 [&>svg]:size-4">
              <Mail />
              Email
            </div>
          </SelectItem>
          <SelectItem value="sms">
            <div className="flex flex-row items-center gap-2 [&>svg]:size-4">
              <Phone />
              SMS
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
