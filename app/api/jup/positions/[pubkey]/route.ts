import { NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate detailed position data
function generatePositionDetail(pubkey: string) {
  const seed = pubkey.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  const shares = Math.round(random(0) * 5000 + 100)
  const entryPrice = 30 + random(1) * 40
  const currentPrice = entryPrice + (random(2) - 0.5) * 5

  return {
    pubkey,
    marketId: `market-detail-${pubkey.substring(0, 8)}`,
    outcome: random(3) > 0.5 ? "yes" : "no",
    shares,
    entryPrice: Math.round(entryPrice * 100) / 100,
    currentPrice: Math.round(currentPrice * 100) / 100,
    cost: Math.round((shares * entryPrice) / 100 * 100) / 100,
    currentValue: Math.round((shares * currentPrice) / 100 * 100) / 100,
    unrealizedPnl: Math.round(((currentPrice - entryPrice) * shares) / 100 * 100) / 100,
    unrealizedPnlPercent: Math.round(((currentPrice - entryPrice) / entryPrice * 100) * 100) / 100,
    timestamp: Date.now() - Math.floor(random(4) * 86400000),
    marketStatus: random(5) > 0.3 ? "active" : "closed",
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
) {
  try {
    const { pubkey } = await params
    
    if (!pubkey || typeof pubkey !== 'string') {
      return errorResponse("Invalid pubkey", 400)
    }
    
    const position = generatePositionDetail(pubkey)
    
    return NextResponse.json(position, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        "Cache-Control": "max-age=5, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[position-detail] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch position", 500, { message })
  }
}
