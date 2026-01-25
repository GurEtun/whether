"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, ArrowUpRight, ArrowDownLeft, Zap, Loader2 } from "lucide-react"
import { useTradeExecution } from "@/hooks/use-trade-execution"

interface TradePanelProps {
  marketId: string
  yesPrice: number
  noPrice: number
  onTradeComplete?: () => void
}

export function TradePanel({ marketId, yesPrice, noPrice, onTradeComplete }: TradePanelProps) {
  const [outcome, setOutcome] = useState<"yes" | "no">("yes")
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  const [priorityFee, setPriorityFee] = useState<"normal" | "fast" | "instant">("normal")
  
  const { executeTrade, isPending, error } = useTradeExecution()
  const [tradeResult, setTradeResult] = useState<any>(null)

  const price = outcome === "yes" ? yesPrice : noPrice
  const amountNum = parseFloat(amount) || 0
  const cost = (amountNum * price) / 100
  const slippageAmount = (cost * parseFloat(slippage)) / 100
  const totalCost = cost + slippageAmount

  const handleTrade = async () => {
    if (!amount || amountNum <= 0) {
      alert("Please enter a valid amount")
      return
    }

    const result = await executeTrade({
      marketId,
      outcome,
      side,
      amount: amountNum,
      price,
      slippage: parseFloat(slippage),
      priorityFee,
    })

    if (result) {
      setTradeResult(result)
      setAmount("")
      onTradeComplete?.()
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Trade Market</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Outcome Selector */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={outcome === "yes" ? "default" : "outline"}
            onClick={() => setOutcome("yes")}
            className="gap-2"
          >
            Yes {yesPrice}¢
          </Button>
          <Button
            variant={outcome === "no" ? "default" : "outline"}
            onClick={() => setOutcome("no")}
            className="gap-2"
          >
            No {noPrice}¢
          </Button>
        </div>

        {/* Side Selector */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={side === "buy" ? "default" : "outline"}
            onClick={() => setSide("buy")}
            className="gap-2"
          >
            <ArrowUpRight className="h-4 w-4" /> Buy
          </Button>
          <Button
            variant={side === "sell" ? "default" : "outline"}
            onClick={() => setSide("sell")}
            className="gap-2"
          >
            <ArrowDownLeft className="h-4 w-4" /> Sell
          </Button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Amount (USD)</label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-secondary"
          />
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
          />
        </div>

        {/* Priority Fee */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Priority Fee</label>
          <div className="grid grid-cols-3 gap-2">
            {(["normal", "fast", "instant"] as const).map((fee) => (
              <Button
                key={fee}
                variant={priorityFee === fee ? "default" : "outline"}
                size="sm"
                className="capitalize"
                onClick={() => setPriorityFee(fee)}
              >
                {fee === "instant" && <Zap className="h-3 w-3 mr-1" />}
                {fee}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Preview */}
        {amountNum > 0 && (
          <div className="rounded-lg bg-secondary/50 p-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span className="font-medium">{price}¢</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage</span>
              <span className="font-medium">${slippageAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-border pt-1.5">
              <span>Total Cost</span>
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
            <p className="text-sm font-medium text-success">Trade Executed!</p>
            <p className="text-xs text-success/80 mt-1">Order ID: {tradeResult.orderId}</p>
          </div>
        )}

        {/* Execute Button */}
        <Button
          onClick={handleTrade}
          disabled={isPending || !amount || amountNum <= 0}
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {side === "buy" ? "Buy" : "Sell"} {outcome} {amountNum > 0 ? `for $${totalCost.toFixed(2)}` : ""}
        </Button>
      </CardContent>
    </Card>
  )
}
