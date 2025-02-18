"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/shared/"

interface AccountSwitcherProps {
  isCollapsed: boolean
  userEmail?: string | null
}

export function AccountSwitcher({ isCollapsed, userEmail }: AccountSwitcherProps) {
  const { logout } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleValueChange = (value: string) => {
    if (value === "logout") {
      handleLogout()
    }
  }

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="User menu"
      >
        <SelectValue placeholder={userEmail}>
          <span className={cn("ml-0", isCollapsed && "hidden")}>{userEmail}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="logout" className="cursor-pointer">
          <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
            <LogOut />
            Logout
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
