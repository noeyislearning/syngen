"use client"

import { PhoneIcon, PhoneOffIcon, MicIcon, MicOffIcon, UserIcon } from "lucide-react"
import * as React from "react"
import { io } from "socket.io-client"

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/shared/"

interface VoiceCallProps {
  receiverName?: string | null
  receiverPhoneNumber?: string | null
  onCallInitiate: () => void // Modified onCallInitiate type
  socket: ReturnType<typeof io> | null
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const VoiceCall: React.FC<VoiceCallProps> = ({
  receiverName,
  receiverPhoneNumber,
  onCallInitiate,
  socket,
  dialogOpen,
  setDialogOpen,
}) => {
  const handleCallButtonClick = () => {
    if (socket) {
      onCallInitiate() // Call onCallInitiate directly
    } else {
      console.error("Socket is not initialized, cannot initiate call.")
      setDialogOpen(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PhoneIcon className="mr-2 h-4 w-4" /> Call {receiverPhoneNumber}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <>
          <DialogHeader>
            <DialogTitle>Start Voice Call?</DialogTitle>
            <DialogDescription>
              {receiverName
                ? `Gonna call ${receiverPhoneNumber}`
                : receiverPhoneNumber
                  ? `Call ${receiverPhoneNumber}`
                  : "Start a voice call"}
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" asChild>
              <DialogClose>Cancel</DialogClose>
            </Button>
            <Button
              type="submit"
              onClick={handleCallButtonClick} // Use direct function call
              variant="default"
            >
              Call
            </Button>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  )
}

// VoiceCallUI Component
interface VoiceCallUIProps {
  onHangUp: () => void
  isMuted: boolean
  toggleMute: () => void
  receiverName?: string | null
}

export const VoiceCallUI: React.FC<VoiceCallUIProps> = ({
  onHangUp,
  isMuted,
  toggleMute,
  receiverName,
}) => {
  const [internalDialogOpen, setInternalDialogOpen] = React.useState(true)

  return (
    <Dialog open={internalDialogOpen} onOpenChange={setInternalDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center p-6">
          <UserIcon className="mb-4 h-12 w-12" />
          <DialogTitle className="mb-2">{receiverName || "Calling..."}</DialogTitle>
          <DialogDescription className="mb-4 text-sm text-muted-foreground">
            Voice call in progress
          </DialogDescription>
          <div className="flex space-x-4">
            <Button variant="outline" size="icon" onClick={toggleMute}>
              {isMuted ? <MicOffIcon className="h-4 w-4" /> : <MicIcon className="h-4 w-4" />}
            </Button>
            <Button variant="destructive" size="icon" onClick={onHangUp}>
              <PhoneOffIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
