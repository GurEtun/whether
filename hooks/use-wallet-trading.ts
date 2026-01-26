'use client'

import { useCallback, useState } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export interface WalletTradeRequest {
  marketId: string
  outcome: 'yes' | 'no'
  shares: number
  priceLimit?: number
  slippage?: number
}

export interface WalletTradeResult {
  success: boolean
  orderId: string
  outcome: 'yes' | 'no'
  shares: number
  filledPrice: number
  totalCost: number
  timestamp: number
  status: 'pending' | 'filled' | 'partial' | 'rejected'
  message?: string
  transactionHash?: string
  userAddress?: string
}

export function useWalletTrading() {
  const { user, isAuthenticated } = useDynamicContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastTrade, setLastTrade] = useState<WalletTradeResult | null>(null)

  const executeTrade = useCallback(
    async (tradeRequest: WalletTradeRequest): Promise<WalletTradeResult | null> => {
      // Check if wallet is connected
      if (!isAuthenticated || !user) {
        const errorMsg = 'Wallet not connected. Please connect your wallet to trade.'
        setError(errorMsg)
        console.error('[useWalletTrading]', errorMsg)
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const userAddress = user.verifiedCredentials?.[0]?.address || user.userId
        
        if (!userAddress) {
          throw new Error('Unable to get wallet address from connected wallet')
        }

        // Call trade execution endpoint with wallet address
        const response = await fetch('/api/trades/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...tradeRequest,
            userAddress,
            side: 'buy',
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Trade failed with status ${response.status}`)
        }

        const result: WalletTradeResult = await response.json()
        
        // Add user address to result
        result.userAddress = userAddress

        // Store last trade
        setLastTrade(result)

        console.log('[useWalletTrading] Trade executed successfully:', result)
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('[useWalletTrading] Trade execution failed:', errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [isAuthenticated, user]
  )

  const canTrade = isAuthenticated && user

  return {
    executeTrade,
    loading,
    error,
    lastTrade,
    canTrade,
    userAddress: user?.verifiedCredentials?.[0]?.address || user?.userId,
    isConnected: isAuthenticated,
  }
}
