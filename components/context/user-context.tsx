"use client"

import * as React from "react"

import { UserContextProps } from "@/lib/types"

export const UserContext = React.createContext<UserContextProps | undefined>(undefined)
