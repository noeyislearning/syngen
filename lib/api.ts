import { API_URL } from "./constants"

export const apiClient = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown> | FormData,
  customHeaders?: HeadersInit,
) => {
  try {
    const accessToken = localStorage.getItem("accessToken")

    let headers: HeadersInit = {}

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`
    }

    if (customHeaders) {
      headers = { ...headers, ...customHeaders }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null, // Don't stringify FormData
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

    return response
  } catch (error) {
    console.error("API Client Error:", error)
    throw error
  }
}
