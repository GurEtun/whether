import { EventEmitter } from "events"

export interface TradeExecutionRequest {
  marketId: string
  outcome: "yes" | "no"
  shares: number
  priceLimit?: number
  userAddress?: string
  slippage?: number
  side?: "buy" | "sell"
}

export interface TradeExecutionResult {
  success: boolean
  orderId: string
  outcome: "yes" | "no"
  shares: number
  filledPrice: number
  totalCost: number
  timestamp: number
  status: "pending" | "filled" | "partial" | "rejected"
  message?: string
  side?: "buy" | "sell"
}

export interface TradingMetrics {
  totalVolume: number
  totalTrades: number
  averagePrice: number
  lastTradeTime: number
  priceChange24h: number
  bidAskSpread: number
}

class TradingEngine extends EventEmitter {
  private metrics: Map<string, TradingMetrics> = new Map()
  private orders: Map<string, TradeExecutionResult> = new Map()
  private marketPrices: Map<string, { yes: number; no: number }> = new Map()

  executeMarketTrade(request: TradeExecutionRequest): TradeExecutionResult {
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // Get or initialize market prices
      let marketPrice = this.marketPrices.get(request.marketId) || {
        yes: 50,
        no: 50,
      }

      // Calculate base price
      const basePrice = request.outcome === "yes" ? marketPrice.yes : marketPrice.no
      
      // Apply slippage - larger orders cause more slippage
      const slippagePercent = (request.slippage || 0.5) * (Math.min(request.shares, 10000) / 1000)
      const priceImpact = (basePrice * slippagePercent) / 100
      const executionPrice = request.outcome === "yes" 
        ? Math.min(99, basePrice + priceImpact)
        : Math.max(1, basePrice - priceImpact)

      // Check price limit
      if (request.priceLimit && executionPrice > request.priceLimit) {
        return {
          success: false,
          orderId,
          outcome: request.outcome,
          shares: request.shares,
          filledPrice: 0,
          totalCost: 0,
          timestamp: Date.now(),
          status: "rejected",
          message: `Price limit exceeded. Expected ${request.priceLimit}¢, got ${Math.round(executionPrice * 100) / 100}¢`,
        }
      }

      // Calculate total cost
      const totalCost = (request.shares * executionPrice) / 100
      
      // Update market prices with momentum
      const newYesPrice = basePrice + (Math.random() - 0.5) * 2
      this.marketPrices.set(request.marketId, {
        yes: Math.max(1, Math.min(99, newYesPrice)),
        no: Math.max(1, Math.min(99, 100 - newYesPrice)),
      })

      const result: TradeExecutionResult = {
        success: true,
        orderId,
        outcome: request.outcome,
        shares: request.shares,
        filledPrice: Math.round(executionPrice * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        timestamp: Date.now(),
        status: "filled",
        side: request.side || "buy",
      }

      // Store order
      this.orders.set(orderId, result)
      
      // Emit trade event
      this.emit("trade", result)

      // Update metrics
      this.updateMetrics(request.marketId, result)

      return result
    } catch (error) {
      console.error("[trading-engine] Trade execution error:", error)
      const message = error instanceof Error ? error.message : "Unknown error"
      return {
        success: false,
        orderId,
        outcome: request.outcome,
        shares: request.shares,
        filledPrice: 0,
        totalCost: 0,
        timestamp: Date.now(),
        status: "rejected",
        message,
      }
    }
  }

  private updateMetrics(marketId: string, trade: TradeExecutionResult) {
    const current = this.metrics.get(marketId) || {
      totalVolume: 0,
      totalTrades: 0,
      averagePrice: 0,
      lastTradeTime: 0,
      priceChange24h: 0,
      bidAskSpread: 0.5,
    }

    current.totalVolume += trade.totalCost
    current.totalTrades += 1
    current.averagePrice = current.totalVolume / current.totalTrades
    current.lastTradeTime = trade.timestamp
    current.priceChange24h = (Math.random() - 0.5) * 20

    this.metrics.set(marketId, current)
  }

  getMetrics(marketId: string): TradingMetrics {
    return this.metrics.get(marketId) || {
      totalVolume: 0,
      totalTrades: 0,
      averagePrice: 0,
      lastTradeTime: 0,
      priceChange24h: 0,
      bidAskSpread: 0.5,
    }
  }

  getOrder(orderId: string): TradeExecutionResult | undefined {
    return this.orders.get(orderId)
  }

  getMarketPrice(marketId: string): { yes: number; no: number } {
    return this.marketPrices.get(marketId) || { yes: 50, no: 50 }
  }

  setMarketPrice(marketId: string, yesPrice: number, noPrice: number): void {
    this.marketPrices.set(marketId, {
      yes: Math.max(1, Math.min(99, yesPrice)),
      no: Math.max(1, Math.min(99, noPrice)),
    })
  }
}

export const tradingEngine = new TradingEngine()
