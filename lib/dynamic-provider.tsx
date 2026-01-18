"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const DynamicContextProviderComponent = dynamic(
  () =>
    Promise.all([import("@dynamic-labs/sdk-react-core"), import("@dynamic-labs/solana")]).then(
      ([{ DynamicContextProvider }, { SolanaWalletConnectors }]) => {
        // Return a component that renders DynamicContextProvider with settings
        return function DynamicProviderInner({ children }: { children: React.ReactNode }) {
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
      },
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  },
)

export function DynamicProvider({ children }: { children: React.ReactNode }) {
  return <DynamicContextProviderComponent>{children}</DynamicContextProviderComponent>
}
