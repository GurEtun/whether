"use client"

import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function WalletButton() {
  const { sdkHasLoaded } = useDynamicContext()

  if (!sdkHasLoaded) {
    return (
      <Button disabled className="gap-2 bg-primary/50 text-primary-foreground">
        <Wallet className="h-4 w-4 animate-pulse" />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    )
  }

  return <DynamicWidget />
}
