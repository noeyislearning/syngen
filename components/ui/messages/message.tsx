"use client"

import * as React from "react"
import { Inbox, Send, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { type MessageType } from "@/data/messages"
import { useMail } from "@/hooks/use-mail"
// import { useUser } from "@/hooks/use-user" // Remove useUser import - not needed here

import { Separator, Tabs, TabsContent } from "@/components/shared/"
import { MessageDisplay } from "@/components/ui/messages/message-display"
import { MessageList } from "@/components/ui/messages/message-list"
import { Nav } from "@/components/ui/nav"
import { AccountSwitcher } from "@/components/ui/account-switcher"

import { TooltipProvider } from "@/components/provider/tooltip-provider"

interface MessageProps {
  messages: MessageType[]
  navCollapsedSize: number
}

export function Message({ messages }: MessageProps) {
  const [isCollapsed] = React.useState(false)
  const [mail] = useMail()
  // const { user } = useUser() // Remove useUser hook - not needed for this filtering

  // Hardcode the userId for now - to test if filtering works.
  const staticUserIdToFilter = "user-1" // Or try "user-2" or any userId from your data.

  const flattenedMessages = React.useMemo(() => {
    return messages.reduce<MessageType["messages"]>(
      (acc, userMessages) => {
        return [...acc, ...userMessages.messages]
      },
      [] as MessageType["messages"],
    )
  }, [messages])

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full items-stretch">
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
            <AccountSwitcher isCollapsed={isCollapsed} userEmail={"test@example.com"} />{" "}
            {/* You can remove userEmail prop if not needed here anymore */}
          </div>

          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Inbox",
                label: "128",
                icon: Inbox,
                variant: "default",
              },
              {
                title: "Sent",
                label: "",
                icon: Send,
                variant: "ghost",
              },
              {
                title: "Trash",
                label: "",
                icon: Trash2,
                variant: "ghost",
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
              <MessageList items={messages} userId={staticUserIdToFilter} />{" "}
              {/* Pass hardcoded userId */}
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-full">
          <MessageDisplay
            message={flattenedMessages.find((item) => item.id === mail.selected) || null}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}
