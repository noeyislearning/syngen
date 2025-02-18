import { API_URL } from "./constants"

export const apiClient = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown>,
) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    })

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        if (errorData && errorData.message) {
          errorMessage += ` - ${errorData.message}`
          if (errorData.errors) {
            errorMessage += ` Errors: ${JSON.stringify(errorData.errors)}`
          }
        }
      } catch (jsonError) {
        console.error("Failed to parse error JSON", jsonError)
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error("API Client Error:", error)
    throw error
  }
}
