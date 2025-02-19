import { atom, useAtom } from "jotai"

import { messages, type MessageType } from "@/data/messages"

type Config = {
  selectedSender: MessageType | null
  selectedMessageId: string | null
}

const configAtom = atom<Config>({
  selectedSender: messages[0] || null,
  selectedMessageId: null,
})

export function useMail() {
  return useAtom(configAtom)
}
