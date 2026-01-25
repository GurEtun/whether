// WebSocket Manager for real-time market data streaming
// Handles connection pooling, reconnection, and message routing

import { EventEmitter } from "eventemitter3"

export interface MarketUpdate {
  marketId: string
  yesPrice: number
  noPrice: number
  volume24h: number
  timestamp: number
  change24h: number
}

export interface TradeEvent {
  id: string
  marketId: string
  price: number
  size: number
  side: "buy" | "sell"
  outcome: "yes" | "no"
  timestamp: number
}

class WebSocketManager extends EventEmitter {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private subscriptions = new Set<string>()

  constructor(url: string = "wss://ws.jup.ag") {
    super()
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log("[WebSocket] Connected to market data stream")
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            console.error("[WebSocket] Failed to parse message:", error)
          }
        }

        this.ws.onerror = (error) => {
          console.error("[WebSocket] Connection error:", error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log("[WebSocket] Connection closed")
          this.attemptReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private handleMessage(data: any) {
    if (data.type === "market_update") {
      this.emit("market_update", data as MarketUpdate)
    } else if (data.type === "trade") {
      this.emit("trade", data as TradeEvent)
    } else if (data.type === "price_update") {
      this.emit("price_update", data)
    }
  }

  subscribe(marketId: string) {
    if (this.subscriptions.has(marketId)) return

    this.subscriptions.add(marketId)

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "subscribe",
          market: marketId,
        })
      )
    }
  }

  unsubscribe(marketId: string) {
    this.subscriptions.delete(marketId)

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "unsubscribe",
          market: marketId,
        })
      )
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      console.log(`[WebSocket] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)

      setTimeout(() => {
        this.connect().catch(() => {
          /* Retry will be attempted in onclose handler */
        })
      }, delay)
    } else {
      console.error("[WebSocket] Max reconnection attempts reached")
      this.emit("error", new Error("Failed to reconnect to market data stream"))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
let instance: WebSocketManager | null = null

export function getWebSocketManager(): WebSocketManager {
  if (!instance) {
    instance = new WebSocketManager()
  }
  return instance
}

export function createWebSocketManager(url?: string): WebSocketManager {
  return new WebSocketManager(url)
}
