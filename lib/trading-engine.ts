import { EventEmitter } from "events"

export interface TradeExecutionRequest {
  marketId: string
  outcome: "yes" | "no"
  shares: number
  priceLimit?: number
  userAddress?: string
  slippage?: number
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

  executeMarketTrade(request: TradeExecutionRequest): TradeExecutionResult {
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Simulate price discovery and execution
    const basePrice = request.outcome === "yes" ? 50 : 50
    const slippage = (request.slippage || 0.5) * (request.shares / 1000)
    const filledPrice = Math.max(1, Math.min(99, basePrice + slippage))
    const totalCost = (request.shares * filledPrice) / 100

    const result: TradeExecutionResult = {
      success: true,
      orderId,
      outcome: request.outcome,
      shares: request.shares,
      filledPrice,
      totalCost,
      timestamp: Date.now(),
      status: "filled",
    }

    // Store order
    this.orders.set(orderId, result)
    
    // Emit trade event
    this.emit("trade", result)

    // Update metrics
    this.updateMetrics(request.marketId, result)

    return result
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
}

export const tradingEngine = new TradingEngine()
