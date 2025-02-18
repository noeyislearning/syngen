import type { Metadata } from "next"

import { geist } from "@/lib/fonts"
import "@/assets/styles/globals.css"
import { metadata as SiteData } from "@/lib/metadata"

export const metadata: Metadata = SiteData

import { ThemeProvider } from "@/components/provider/theme-provider"
import { UserProvider } from "@/components/provider/user-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body className="antialiased">
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
