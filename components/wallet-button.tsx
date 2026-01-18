"use client"

import { Component, useEffect, useState, type ComponentType, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

// Check if we're in a preview environment
function isPreviewEnvironment(): boolean {
  if (typeof window === "undefined") return true
  const hostname = window.location.hostname
  return (
    hostname.includes("vusercontent.net") ||
    hostname.includes("v0.dev") ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes(".vercel.app")
  )
}

// Error boundary to catch context errors
class WidgetErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // Silently handle errors
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

function SignUpButton() {
  return (
    <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
      <Wallet className="h-4 w-4" />
      <span>Sign Up</span>
    </Button>
  )
}

export function WalletButton() {
  const [Widget, setWidget] = useState<ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    // Check if in preview environment first
    if (isPreviewEnvironment()) {
      setIsPreview(true)
      setIsLoading(false)
      return
    }

    let mounted = true

    const loadWidget = async () => {
      try {
        const { DynamicWidget } = await import("@dynamic-labs/sdk-react-core")
        if (mounted) {
          setWidget(() => DynamicWidget)
          setIsLoading(false)
        }
      } catch {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadWidget()

    return () => {
      mounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <Button disabled className="gap-2 bg-primary/50 text-primary-foreground">
        <Wallet className="h-4 w-4 animate-pulse" />
        <span>Loading...</span>
      </Button>
    )
  }

  // In preview environments, show sign up button
  if (isPreview || !Widget) {
    return <SignUpButton />
  }

  return (
    <WidgetErrorBoundary fallback={<SignUpButton />}>
      <Widget />
    </WidgetErrorBoundary>
  )
}
