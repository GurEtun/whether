"use client"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

const DynamicWalletWidget = dynamic(
  () =>
    import("@dynamic-labs/sdk-react-core").then(({ DynamicWidget }) => {
      return function WalletWidget() {
        return <DynamicWidget />
      }
    }),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="gap-2 bg-primary/50 text-primary-foreground">
        <Wallet className="h-4 w-4 animate-pulse" />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    ),
  },
)

export function WalletButton() {
  return <DynamicWalletWidget />
}
