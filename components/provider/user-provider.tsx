"use client"

import * as React from "react"

import { UserContext } from "@/components/context/user-context"
import { UserProps, UserContextProps, UserProviderProps } from "@/lib/types"

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<UserProps | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  const login = (userData: UserProps) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as UserProps
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const value: UserContextProps = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    login,
    logout,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
