import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { DynamicProvider } from "@/lib/dynamic-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { ScrollToTop } from "@/components/scroll-to-top"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Whether | Social Prediction Markets on Solana",
  description: "Trade on real-world events with AI-powered analysis and community insights. Built on Solana.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <QueryProvider>
          <DynamicProvider>
            <ScrollToTop />
            {children}
          </DynamicProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
