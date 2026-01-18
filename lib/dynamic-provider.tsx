"use client"

import React from "react"

// Check if we're in a preview/development environment where Dynamic SDK won't work
function isPreviewEnvironment(): boolean {
  if (typeof window === "undefined") return true
  const hostname = window.location.hostname
  // Skip Dynamic SDK in v0 preview, localhost, and Vercel preview deployments
  return (
    hostname.includes("vusercontent.net") ||
    hostname.includes("v0.dev") ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes(".vercel.app")
  )
}

export function DynamicProvider({ children }: { children: React.ReactNode }) {
  // In preview environments, skip Dynamic SDK entirely to avoid fetch errors
  if (typeof window !== "undefined" && isPreviewEnvironment()) {
    return <>{children}</>
  }

  // For production with proper domain allowlisting, load the SDK
  return <DynamicProviderInner>{children}</DynamicProviderInner>
}

// Separate component for actual SDK loading (only used in production)
function DynamicProviderInner({ children }: { children: React.ReactNode }) {
  const [Provider, setProvider] = React.useState<React.ComponentType<{ children: React.ReactNode }> | null>(null)
  const [isReady, setIsReady] = React.useState(false)
  const loadAttempted = React.useRef(false)

  React.useEffect(() => {
    if (loadAttempted.current) return
    loadAttempted.current = true

    let mounted = true

    const loadDynamic = async () => {
      try {
        const [{ DynamicContextProvider }, { SolanaWalletConnectors }] = await Promise.all([
          import("@dynamic-labs/sdk-react-core"),
          import("@dynamic-labs/solana"),
        ])

        if (mounted) {
          const ProviderComponent = ({ children }: { children: React.ReactNode }) => (
            <DynamicContextProvider
              settings={{
                environmentId: "0fe280f0-4765-48ea-9fe5-88a96192e920",
                walletConnectors: [SolanaWalletConnectors],
              }}
            >
              {children}
            </DynamicContextProvider>
          )
          setProvider(() => ProviderComponent)
          setIsReady(true)
        }
      } catch {
        if (mounted) {
          setIsReady(true) // Fail silently, just render children
        }
      }
    }

    loadDynamic()

    return () => {
      mounted = false
    }
  }, [])

  if (!isReady) {
    return <>{children}</>
  }

  if (!Provider) {
    return <>{children}</>
  }

  return <Provider>{children}</Provider>
}
