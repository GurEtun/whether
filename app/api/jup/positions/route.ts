import { NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate mock positions for a pubkey
function generatePositions(pubkey: string, limit: number = 20) {
  const seed = pubkey.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const positions = []

  for (let i = 0; i < limit; i++) {
    const random = (offset: number) => {
      const x = Math.sin(seed + offset + i) * 10000
      return x - Math.floor(x)
    }

    const outcome = random(0) > 0.5 ? "yes" : "no"
    const price = 30 + random(1) * 40
    const shares = Math.round(random(2) * 1000 + 100)
    const currentValue = (shares * price) / 100

    positions.push({
      id: `pos-${pubkey.substring(0, 4)}-${i}`,
      marketId: `market-${i + 1}`,
      outcome,
      shares,
      entryPrice: Math.round(price * 100) / 100,
      currentPrice: Math.round((price + (random(3) - 0.5) * 3) * 100) / 100,
      currentValue: Math.round(currentValue * 100) / 100,
      pnl: Math.round((currentValue - (shares * price) / 100) * 100) / 100,
      pnlPercent: Math.round((random(4) - 0.5) * 30 * 100) / 100,
      timestamp: Date.now() - i * 86400000,
    })
  }

  return positions
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pubkey = searchParams.get("pubkey")
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    
    if (!pubkey) {
      return errorResponse("pubkey is required", 400)
    }
    
    const positions = generatePositions(pubkey, Math.min(limit, 100))
    
    return NextResponse.json(
      { positions },
      {
        status: 200,
        headers: {
          ...getCorsHeaders(),
          "Cache-Control": "max-age=5, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[positions-list] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch positions", 500, { message })
  }
}
