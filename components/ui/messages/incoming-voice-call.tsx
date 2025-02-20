"use client"

import * as React from "react"
import { PhoneIcon, PhoneOffIcon, UserIcon } from "lucide-react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/"

interface IncomingVoiceCallProps {
  callerId: string | null
  onAnswer: () => void
  onReject: () => void
}

export const IncomingVoiceCall: React.FC<IncomingVoiceCallProps> = ({
  callerId,
  onAnswer,
  onReject,
}) => {
  const handleAnswerClick = () => {
    console.log("Answering call in IncomingCallDialog...")
    onAnswer()
  }

  const handleRejectClick = () => {
    console.log("Rejecting call in IncomingCallDialog...")
    onReject()
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Incoming Voice Call</DialogTitle>
          <DialogDescription>Voice call from {callerId}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <UserIcon className="mb-4 h-12 w-12" />
          <DialogTitle className="mb-2">Incoming Call</DialogTitle>
          <DialogDescription className="mb-4 text-sm text-muted-foreground">
            Voice call from {callerId}
          </DialogDescription>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleRejectClick}>
              <PhoneOffIcon className="destructive h-4 w-4" />
              Reject
            </Button>
            <Button variant="default" onClick={handleAnswerClick}>
              <PhoneIcon className="h-4 w-4" />
              Answer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
