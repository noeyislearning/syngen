"use client"

import * as React from "react"

import { FormFieldContextProps } from "@/lib/types"

export const FormFieldContext = React.createContext<FormFieldContextProps>(
  {} as FormFieldContextProps,
)
