import { atom, useAtom } from "jotai"

import { MessageTypeProps } from "@/lib/types"

type Config = {
  selectedSender: MessageTypeProps | null
  selectedMessageId: string | null
}

const configAtom = atom<Config>({
  selectedSender: null,
  selectedMessageId: null,
})

export function useMail() {
  return useAtom(configAtom)
}
