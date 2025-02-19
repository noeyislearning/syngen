import { atom, useAtom } from "jotai"

import { messages, type MessageType } from "@/data/messages"

type Config = {
  selected: MessageType["messages"][number]["id"] | null
}

const configAtom = atom<Config>({
  selected: messages[0]?.messages[0]?.id || null,
})

export function useMail() {
  return useAtom(configAtom)
}
