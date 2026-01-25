// Real-time event streaming and market data updates
// Provides polling and event-based updates for market data

import { QueryClient } from "@tanstack/react-query"

export interface MarketDataUpdate {
  marketId: string
  yesPrice: number
  noPrice: number
  volume24h: number
  traders24h: number
  priceChange24h: number
  lastUpdate: number
}

export interface PricePoint {
  timestamp: number
  yesPrice: number
  noPrice: number
  volume: number
}

class RealTimeEventManager {
  private queryClient: QueryClient | null = null
  private updateIntervals = new Map<string, NodeJS.Timeout>()
  private subscribers = new Map<string, Set<(data: MarketDataUpdate) => void>>()

  setQueryClient(client: QueryClient) {
    this.queryClient = client
  }

  subscribeToMarket(marketId: string, callback: (data: MarketDataUpdate) => void, interval = 2000) {
    // Add callback to subscribers
    if (!this.subscribers.has(marketId)) {
      this.subscribers.set(marketId, new Set())
    }
    this.subscribers.get(marketId)!.add(callback)

    // Start polling if not already started
    if (!this.updateIntervals.has(marketId)) {
      this.startPolling(marketId, interval)
    }
  }

  unsubscribeFromMarket(marketId: string, callback: (data: MarketDataUpdate) => void) {
    const subscribers = this.subscribers.get(marketId)
    if (subscribers) {
      subscribers.delete(callback)

      // Stop polling if no more subscribers
      if (subscribers.size === 0) {
        this.stopPolling(marketId)
      }
    }
  }

  private async startPolling(marketId: string, interval: number) {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/jup/markets/${marketId}/live`)
        if (!response.ok) throw new Error(`API error: ${response.status}`)

        const data = await response.json()
        const update: MarketDataUpdate = {
          marketId,
          yesPrice: data.yesPrice,
          noPrice: data.noPrice,
          volume24h: data.volume24h,
          traders24h: data.traders24h || 0,
          priceChange24h: data.priceChange24h,
          lastUpdate: Date.now(),
        }

        // Notify all subscribers
        const subscribers = this.subscribers.get(marketId)
        if (subscribers) {
          subscribers.forEach((callback) => callback(update))
        }

        // Update React Query cache
        if (this.queryClient) {
          this.queryClient.setQueryData(["market", marketId], update)
        }
      } catch (error) {
        console.error(`[EventManager] Error fetching market data for ${marketId}:`, error)
      }
    }, interval)

    this.updateIntervals.set(marketId, pollInterval)
  }

  private stopPolling(marketId: string) {
    const interval = this.updateIntervals.get(marketId)
    if (interval) {
      clearInterval(interval)
      this.updateIntervals.delete(marketId)
    }
  }

  async fetchPriceHistory(marketId: string, resolution: string = "1h", limit: number = 100) {
    try {
      const response = await fetch(
        `/api/jup/markets/${marketId}/price-history?resolution=${resolution}&limit=${limit}`
      )
      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data = await response.json()
      return data.prices || []
    } catch (error) {
      console.error(`[EventManager] Error fetching price history for ${marketId}:`, error)
      return []
    }
  }

  async fetchRecentTrades(marketId: string, limit: number = 20) {
    try {
      const response = await fetch(`/api/jup/markets/${marketId}/trades?limit=${limit}`)
      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data = await response.json()
      return data.trades || []
    } catch (error) {
      console.error(`[EventManager] Error fetching trades for ${marketId}:`, error)
      return []
    }
  }

  cleanup() {
    // Clear all intervals
    this.updateIntervals.forEach((interval) => clearInterval(interval))
    this.updateIntervals.clear()
    this.subscribers.clear()
  }
}

// Singleton instance
let instance: RealTimeEventManager | null = null

export function getRealTimeEventManager(): RealTimeEventManager {
  if (!instance) {
    instance = new RealTimeEventManager()
  }
  return instance
}
