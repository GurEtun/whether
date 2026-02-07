"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Loader2, Wallet } from "lucide-react"
import { useWalletTrading } from "@/hooks/use-wallet-trading"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"

interface QuickTradeButtonProps {
  marketId: string
  outcome: "yes" | "no"
  price: number
  compact?: boolean
}

export function QuickTradeButton({ marketId, outcome, price, compact = false }: QuickTradeButtonProps) {
  const [shares, setShares] = useState(10)
  const [showDetails, setShowDetails] = useState(false)
  const { executeTrade, loading, error, isConnected } = useWalletTrading()
  const { setShowAuthFlow } = useDynamicContext()

  const cost = (shares * price) / 100

  const handleQuickTrade = async () => {
    if (!isConnected) {
      setShowAuthFlow?.(true)
      return
    }

    const result = await executeTrade({
      marketId,
      outcome,
      shares,
    })

    if (result) {
      setShares(10)
      setShowDetails(false)
    }
  }

  if (compact) {
    return (
      <Button
        onClick={handleQuickTrade}
        disabled={loading || !isConnected}
        variant={outcome === "yes" ? "default" : "secondary"}
        size="sm"
        className="gap-1"
      >
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
        {!isConnected ? (
          <>
            <Wallet className="h-3 w-3" />
            <span className="hidden sm:inline">Connect</span>
          </>
        ) : (
          <>
            {outcome === "yes" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownLeft className="h-3 w-3" />
            )}
            {outcome === "yes" ? "Yes" : "No"} {price}¢
          </>
        )}
      </Button>
    )
  }

  return (
    <Card className="p-3 border-border">
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Badge variant={outcome === "yes" ? "default" : "secondary"} className="capitalize">
            {outcome} @ {price}¢
          </Badge>
          {isConnected ? (
            <Badge variant="outline" className="text-success">
              Ready
            </Badge>
          ) : (
            <Badge variant="outline" className="text-warning">
              Not Connected
            </Badge>
          )}
        </div>

        {/* Toggle Details */}
        {showDetails && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shares:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShares(Math.max(1, shares - 5))}
                  disabled={shares <= 1}
                  className="h-6 w-6 p-0"
                >
                  −
                </Button>
                <span className="w-8 text-center font-medium">{shares}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShares(shares + 5)}
                  disabled={shares >= 1000}
                  className="h-6 w-6 p-0"
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cost:</span>
              <span className="font-medium">${cost.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <p className="text-xs text-danger bg-danger/10 p-2 rounded">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={loading}
          >
            {showDetails ? "Hide" : "Details"}
          </Button>
          <Button
            onClick={handleQuickTrade}
            disabled={loading || !isConnected}
            className="flex-1 gap-1"
          >
            {loading && <Loader2 className="h-3 w-3 animate-spin" />}
            {!isConnected ? "Connect" : `Buy`}
          </Button>
        </div>
      </div>
    </Card>
  )
}
