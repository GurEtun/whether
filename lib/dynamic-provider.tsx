"use client"

import type React from "react"
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core"
import { SolanaWalletConnectors } from "@dynamic-labs/solana"

export function DynamicProvider({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "0fe280f0-4765-48ea-9fe5-88a96192e920",
        walletConnectors: [SolanaWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}
