"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, ArrowUpRight, ArrowDownLeft, Zap, Loader2, Wallet } from "lucide-react"
import { useWalletTrading } from "@/hooks/use-wallet-trading"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"

interface TradePanelProps {
  marketId: string
  yesPrice: number
  noPrice: number
  onTradeComplete?: () => void
}

export function TradePanel({ marketId, yesPrice, noPrice, onTradeComplete }: TradePanelProps) {
  const [outcome, setOutcome] = useState<"yes" | "no">("yes")
  const [shares, setShares] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  const [showWalletPrompt, setShowWalletPrompt] = useState(false)
  
  const { executeTrade, loading, error, lastTrade, canTrade, isConnected } = useWalletTrading()
  const { setShowAuthFlow } = useDynamicContext()
  const [tradeResult, setTradeResult] = useState<any>(null)

  const price = outcome === "yes" ? yesPrice : noPrice
  const sharesNum = parseFloat(shares) || 0
  const cost = (sharesNum * price) / 100
  const slippageAmount = (cost * parseFloat(slippage)) / 100
  const totalCost = cost + slippageAmount

  const handleTrade = async () => {
    // Validate wallet connection
    if (!canTrade || !isConnected) {
      setShowWalletPrompt(true)
      setShowAuthFlow?.(true)
      return
    }

    if (!shares || sharesNum <= 0) {
      alert("Please enter a valid number of shares")
      return
    }

    if (sharesNum > 1000000) {
      alert("Maximum 1,000,000 shares per trade")
      return
    }

    console.log("[v0] Executing trade:", { marketId, outcome, shares: sharesNum, price })

    const result = await executeTrade({
      marketId,
      outcome,
      shares: sharesNum,
      slippage: parseFloat(slippage),
    })

    if (result) {
      setTradeResult(result)
      setShares("")
      onTradeComplete?.()
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Trade Market</CardTitle>
          {!isConnected && (
            <Badge variant="outline" className="gap-1">
              <Wallet className="h-3 w-3" />
              Not Connected
            </Badge>
          )}
          {isConnected && (
            <Badge variant="default" className="gap-1 bg-success/20 text-success border-success/30">
              <Wallet className="h-3 w-3" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Connection Prompt */}
        {showWalletPrompt && !isConnected && (
          <div className="rounded-lg bg-warning/10 border border-warning/30 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Connect Your Wallet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please connect your wallet to start trading on Whether.
                </p>
                <Button
                  onClick={() => setShowAuthFlow?.(true)}
                  size="sm"
                  className="mt-3 gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Outcome Selector */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={outcome === "yes" ? "default" : "outline"}
            onClick={() => setOutcome("yes")}
            className="gap-2"
            disabled={!isConnected}
          >
            Yes {yesPrice}¢
          </Button>
          <Button
            variant={outcome === "no" ? "default" : "outline"}
            onClick={() => setOutcome("no")}
            className="gap-2"
            disabled={!isConnected}
          >
            No {noPrice}¢
          </Button>
        </div>

        {/* Shares Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Shares</label>
          <Input
            type="number"
            placeholder="0"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            className="bg-secondary"
            disabled={!isConnected}
            min="1"
            max="1000000"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Max: 1,000,000 shares • Current Price: {price}¢ per share
          </p>
        </div>

        {/* Slippage Control */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Max Slippage: {slippage}%</label>
          <Slider
            value={[parseFloat(slippage)]}
            onValueChange={(v) => setSlippage(v[0].toFixed(2))}
            min={0.1}
            max={5}
            step={0.1}
            className="w-full"
            disabled={!isConnected}
          />
        </div>

        {/* Price Preview */}
        {sharesNum > 0 && (
          <div className="rounded-lg bg-secondary/50 p-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per Share</span>
              <span className="font-medium">{price}¢</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shares × Price</span>
              <span className="font-medium">${cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Max Slippage ({slippage}%)</span>
              <span className="font-medium">${slippageAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-border pt-1.5">
              <span>Total Cost (Estimated)</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="rounded-lg bg-danger/10 border border-danger/20 p-3 flex gap-2">
            <AlertCircle className="h-4 w-4 text-danger flex-shrink-0 mt-0.5" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Trade Result */}
        {tradeResult && (
          <div className="rounded-lg bg-success/10 border border-success/20 p-3">
            <p className="text-sm font-medium text-success">✓ Trade Executed Successfully!</p>
            <div className="text-xs text-success/80 mt-2 space-y-1">
              <p>Order ID: {tradeResult.orderId}</p>
              <p>Filled Price: {tradeResult.filledPrice}¢</p>
              <p>Total Cost: ${tradeResult.totalCost.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Execute Button */}
        <Button
          onClick={handleTrade}
          disabled={loading || !shares || sharesNum <= 0 || !isConnected}
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {!isConnected ? (
            <>
              <Wallet className="h-4 w-4" />
              Connect Wallet to Trade
            </>
          ) : (
            <>
              <ArrowUpRight className="h-4 w-4" />
              Buy {outcome} for {sharesNum > 0 ? `$${totalCost.toFixed(2)}` : ""}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
