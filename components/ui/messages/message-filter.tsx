"use client"

import * as React from "react"
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
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Message Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="chat">Chat</SelectItem>
          <SelectItem value="email">Email</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
