"use client"

import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { useWalletTrading } from "@/hooks/use-wallet-trading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, Check, AlertCircle, Loader2 } from "lucide-react"

export function WalletStatus() {
  const { user, setShowAuthFlow, isLoading } = useDynamicContext()
  const { isConnected, userAddress } = useWalletTrading()

  if (isLoading) {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Connecting...
      </Badge>
    )
  }

  if (!isConnected || !user) {
    return (
      <Button
        onClick={() => setShowAuthFlow?.(true)}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  const displayAddress = userAddress 
    ? `${userAddress.substring(0, 4)}...${userAddress.substring(userAddress.length - 4)}`
    : "Connected"

  return (
    <Badge variant="default" className="gap-2 bg-success/20 text-success border-success/30">
      <Check className="h-3 w-3" />
      <span className="font-mono text-xs">{displayAddress}</span>
    </Badge>
  )
}

export function WalletStatusDetailed() {
  const { user, setShowAuthFlow, isLoading, signUserMessage } = useDynamicContext()
  const { isConnected, userAddress, lastTrade } = useWalletTrading()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Connecting wallet...</span>
      </div>
    )
  }

  if (!isConnected || !user) {
    return (
      <Button
        onClick={() => setShowAuthFlow?.(true)}
        className="gap-2"
      >
        <Wallet className="h-4 w-4" />
        Connect Your Solana Wallet
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Connected Wallet:</span>
        <Badge variant="default" className="gap-1">
          <Check className="h-3 w-3" />
          Active
        </Badge>
      </div>
      <div className="font-mono text-sm bg-muted p-2 rounded">
        {userAddress}
      </div>
      {lastTrade && (
        <div className="text-xs text-muted-foreground">
          Last trade: {new Date(lastTrade.timestamp).toLocaleString()}
        </div>
      )}
      <Button
        onClick={() => setShowAuthFlow?.(true)}
        variant="outline"
        size="sm"
        className="w-full"
      >
        Switch Wallet
      </Button>
    </div>
  )
}
