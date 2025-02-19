import { apiClient } from "../api"
import { MessageTypeProps, SendMessageRequestPayloadProps } from "../types"

export const getMessages = async (): Promise<MessageTypeProps[]> => {
  return apiClient("/message", "GET") as Promise<MessageTypeProps[]>
}

export const sendMessage = async (payload: SendMessageRequestPayloadProps) => {
  return apiClient("/message", "POST", payload)
}
