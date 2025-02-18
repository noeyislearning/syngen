"use client"

import * as React from "react"

import { SidebarContext as Contenxt } from "@/lib/types"

export const SidebarContext = React.createContext<Contenxt | null>(null)
