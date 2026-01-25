'use client';

import React from "react"

import useSWR from "swr"

interface TradeOrder {
  id: string
  marketId: string
  outcome: "yes" | "no"
  side: "buy" | "sell"
  amount: number
  price: number
  status: "pending" | "filled" | "cancelled"
  executedAt?: number
  timestamp: number
}

interface ExecuteTradeParams {
  marketId: string
  outcome: "yes" | "no"
  side: "buy" | "sell"
  amount: number
  price: number
  slippage?: number
  priorityFee?: "normal" | "fast" | "instant"
}

interface TradeResponse {
  success: boolean
  orderId: string
  executedPrice: number
  executedAmount: number
  cost: number
  fee: number
  timestamp: number
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useTradeExecution() {
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const executeTrade = async (params: ExecuteTradeParams): Promise<TradeResponse | null> => {
    setIsPending(true)
    setError(null)

    try {
      const response = await fetch("/api/trades/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to execute trade")
      }

      const data = await response.json()
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      return null
    } finally {
      setIsPending(false)
    }
  }

  return { executeTrade, isPending, error }
}

export function useTradeOrders(marketId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/trades/orders?marketId=${marketId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
      focusThrottleInterval: 5000,
    }
  )

  return {
    orders: (data?.orders as TradeOrder[]) || [],
    isLoading,
    error,
    mutate,
  }
}

export function useTradeHistory(pubkey: string) {
  const { data, error, isLoading, mutate } = useSWR(
    pubkey ? `/api/trades/history?pubkey=${pubkey}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    history: data?.history || [],
    isLoading,
    error,
    mutate,
  }
}
