import { format } from "date-fns/format"
import * as React from "react"
import { MailIcon, PhoneCall } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Separator,
  Textarea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/shared/"
import type { MessageType } from "@/data/messages"

type IndividualMessage = MessageType["messages"][number] & { name: string }

interface MessageDisplayProps {
  message: IndividualMessage | null
}

export function MessageDisplay({ message }: MessageDisplayProps) {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = React.useState(false)

  if (!message) {
    return <div className="p-8 text-center text-muted-foreground">No message selected</div>
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" disabled={!message}>
            <PhoneCall className="h-4 w-4 text-emerald-400" />
            <span className="sr-only">Call</span>
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex items-start gap-4 text-sm">
          <Avatar>
            <AvatarImage alt={message.name} />
            <AvatarFallback>
              {message.name
                .split(" ")
                .map((chunk) => chunk[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="font-semibold">{message.name}</div>
            {message.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(message.date), "PPpp")}
              </div>
            )}
          </div>
        </div>
        <Separator />
        <div className="mt-4 flex flex-col gap-2">
          {message.messageType === "email" ? (
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
              <div className="flex w-2/3 flex-row items-center gap-2">
                <DialogTrigger asChild>
                  <div className="w-fit max-w-[70%] cursor-pointer whitespace-pre-wrap border border-muted p-3 text-sm">
                    <div className="flex flex-row items-center gap-2">
                      <p>{message.subject}</p>
                      <MailIcon className="h-4 w-4 opacity-70" />
                    </div>
                    <p className="line-clamp-2">{message.text.substring(0, 300)}</p>
                  </div>
                </DialogTrigger>
              </div>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{message.subject}</DialogTitle>
                  <DialogDescription>
                    From: {message.name}
                    <br />
                    Date: {message.date ? format(new Date(message.date), "PPpp") : "N/A"}
                  </DialogDescription>
                </DialogHeader>
                <div className="whitespace-pre-wrap py-4">{message.text}</div>
                <DialogFooter>
                  <Button onClick={() => setIsEmailDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : message.messageType === "chat" ? (
            <div className="mb-2 w-fit max-w-[70%] rounded-md bg-primary p-3">
              <p className="whitespace-pre-wrap text-sm">{message.text}</p>
            </div>
          ) : null}
        </div>
      </div>
      <Separator className="mt-auto" />
      <div className="p-4">
        <form>
          <div className="grid gap-4">
            <Textarea className="p-4" placeholder={`Reply ${message.name}...`} />
            <div className="flex items-center">
              <Button onClick={(e) => e.preventDefault()} size="sm" className="ml-auto">
                Reply
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
