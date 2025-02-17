import { Metadata } from "next"

const siteName = "Syngen"
const siteURL = "https://syngen.io" // Example URL
const siteDescription = " Building a fully functional omni-channel communication app. Explore the implementation of features to support various communication channels in a cohesive and integrated manner."

export const metadata: Metadata = {
  title: {
    default: siteName,
    template:  "%s | " + siteName,
  },
  description: siteDescription,
  generator: siteName,
  applicationName: siteName,
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteURL,
    locale: "en_US",
    type: "website",
    siteName: siteName,
    countryName: "Philippines"
  }
}