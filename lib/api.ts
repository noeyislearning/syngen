import { API_URL } from "./constants"

export const apiClient = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown> | FormData,
  customHeaders?: HeadersInit,
) => {
  try {
    const accessToken = localStorage.getItem("accessToken")

    let headers: HeadersInit = {} // Initialize as empty object

    if (!(body instanceof FormData)) {
      // Check if body is NOT FormData
      headers["Content-Type"] = "application/json" // Only set for JSON bodies
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`
    }

    // Merge custom headers if provided, overwriting defaults if necessary
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

    return await response.json()
  } catch (error) {
    console.error("API Client Error:", error)
    throw error
  }
}
