"use client"

import * as React from "react"

import { UserContext } from "@/components/context/user-context"
import { UserProps, UserContextProps, UserProviderProps } from "@/lib/types"
import { apiClient } from "@/lib/api"

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
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const response = await apiClient("/user/profile", "GET")
        const userDataFromApi: UserProps = {
          userId: response._id,
          email: response.email,
          phoneNumber: response.phoneNumber,
        }

        setUser(userDataFromApi)
        localStorage.setItem("user", JSON.stringify(userDataFromApi))
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUser(null)
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

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
      } finally {
        if (!storedUser) {
          fetchUserData()
        } else {
          setIsLoading(false)
        }
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
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
