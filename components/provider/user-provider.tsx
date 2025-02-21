"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { UserProps, UserContextProps, UserProviderProps } from "@/lib/types"
import { apiClient } from "@/lib/api"

import { UserContext } from "@/components/context/user-context"

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = React.useState<UserProps | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [isLoggingOut, setIsLoggingOut] = React.useState<boolean>(false)

  const login = (userData: UserProps) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    fetchUserData()
  }

  const logout = () => {
    setIsLoggingOut(true)
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient("/user/profile", "GET")
      if (response) {
        const userDataFromApi: UserProps = {
          userId: response._id,
          email: response.email,
          phoneNumber: response.phoneNumber,
        }
        setUser(userDataFromApi)
        localStorage.setItem("user", JSON.stringify(userDataFromApi))
      } else {
        console.warn(
          "API response for user profile was empty or undefined, assuming not logged in.",
        )
        setUser(null)
        localStorage.removeItem("user")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setUser(null)
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    setIsLoading(true)

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as UserProps
        setUser(parsedUser)
        fetchUserData()
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("user")
        fetchUserData()
      }
    } else {
      fetchUserData()
    }
  }, [])

  const value: UserContextProps = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    login,
    logout,
    isLoggingOut,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
