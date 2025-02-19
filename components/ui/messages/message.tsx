"use client"

import * as React from "react"
import { Inbox } from "lucide-react"

import { cn } from "@/lib/utils"
import { MessageTypeProps } from "@/lib/types"
import { useUser } from "@/hooks/use-user"
import { useMail } from "@/hooks/use-mail"

import { Separator, Tabs, TabsContent } from "@/components/shared/"
import { MessageDisplay } from "@/components/ui/messages/message-display"
import { MessageList } from "@/components/ui/messages/message-list"
import { Nav } from "@/components/ui/nav"
import { AccountSwitcher } from "@/components/ui/account-switcher"

import { TooltipProvider } from "@/components/provider/tooltip-provider"

interface MessageProps {
  messages: MessageTypeProps[]
  navCollapsedSize: number
}

export function Message({ messages }: MessageProps) {
  const [isCollapsed] = React.useState(false)
  const { user } = useUser()
  const [mail] = useMail()

  const conversationCount = messages ? messages.length : 0

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full w-full items-stretch">
        <div
          className={cn(
            "flex flex-col",
            "w-[20%] min-w-[150px] max-w-[200px]",
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2",
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} userEmail={user?.email} />
          </div>

          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Inbox",
                label: conversationCount.toString(),
                icon: Inbox,
                variant: "default",
              },
            ]}
          />
        </div>
        <div className="flex h-full w-[30%] min-w-[250px] flex-col">
          <Tabs defaultValue="all" className="flex h-full flex-col">
            <div className="flex items-center px-4 py-3">
              <h1 className="text-xl font-bold">Inbox</h1>
            </div>
            <Separator />
            <TabsContent value="all" className="m-0 flex-grow overflow-auto">
              <MessageList items={messages} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex w-full flex-col">
          <MessageDisplay message={mail.selectedSender || null} userId={user?.userId} />
        </div>
      </div>
    </TooltipProvider>
  )
}
