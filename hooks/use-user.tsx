import * as React from "react"

import { UserContext } from "@/components/context/user-context"

export const useUser = () => {
  const context = React.useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
