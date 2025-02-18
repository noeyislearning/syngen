"use client"

import * as React from "react"

import { SidebarContextProps } from "@/lib/types"

export const SidebarContext = React.createContext<SidebarContextProps | null>(null)
