import { NextResponse } from "next/server"
import { getCorsHeaders, errorResponse } from "@/lib/jup-client"

// Generate realistic trade data
function generateTrades() {
  const now = Date.now()
  const trades = []
  const marketIds = ["btc-150k", "eth-10k", "trump-2024", "ai-agi-2025"]

  for (let i = 0; i < 50; i++) {
    const marketId = marketIds[i % marketIds.length]
    const timestamp = now - i * 60000 // 1 minute apart
    const seed = timestamp + i
    const random = () => {
      const x = Math.sin(seed + i) * 10000
      return x - Math.floor(x)
    }

    const side = random() > 0.5 ? "yes" : "no"
    const action = random() > 0.5 ? "buy" : "sell"
    const priceUsd = 0.30 + random() * 0.40 // $0.30 - $0.70
    const amountUsd = 50 + random() * 500 // $50 - $550

    trades.push({
      id: `trade-${i}`,
      marketId,
      timestamp,
      action,
      side,
      priceUsd: priceUsd.toFixed(4),
      amountUsd: amountUsd.toFixed(2),
      txSignature: `${Math.random().toString(36).substr(2, 9)}...`,
    })
  }

  return trades
}

export async function GET() {
  try {
    const trades = generateTrades()
    
    return NextResponse.json(trades, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch trades", 500, { message })
  }
}
