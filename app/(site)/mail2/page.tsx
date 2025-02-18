import { cookies } from "next/headers"

import { Mail } from "@/components/ui/mail/mail"
import { accounts, mails } from "@/data/mails"

export default async function MailPage() {
  const cookiesData = await cookies()
  const layoutCookie = cookiesData.get("react-resizable-panels:layout:mail")
  const collapsedCookie = cookiesData.get("react-resizable-panels:collapsed")

  const defaultLayout = layoutCookie ? JSON.parse(layoutCookie.value) : undefined
  const defaultCollapsed = collapsedCookie ? JSON.parse(collapsedCookie.value) : undefined

  return (
    <div className="flex h-screen">
      <Mail
        accounts={accounts}
        mails={mails}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      />
    </div>
  )
}
