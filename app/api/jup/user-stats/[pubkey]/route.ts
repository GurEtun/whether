import { NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate user statistics
function generateUserStats(pubkey: string) {
  const seed = pubkey.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000
    return x - Math.floor(x)
  }

  const totalVolume = Math.round(random(0) * 5000000 + 50000)
  const totalTrades = Math.floor(random(1) * 500 + 5)
  const profitableTrades = Math.floor((random(2) * totalTrades))
  const winRate = Math.round((profitableTrades / totalTrades * 100) * 100) / 100

  return {
    pubkey,
    username: `Trader${Math.floor(Math.random() * 100000)}`,
    totalVolume,
    totalTrades,
    profitableTrades,
    winRate,
    totalProfit: Math.round((random(3) - 0.5) * 100000),
    avgProfit: Math.round(random(4) * 10000),
    highestGain: Math.round(random(5) * 50000),
    largestLoss: Math.round(-(random(6) * 30000)),
    currentBalance: Math.round(random(7) * 1000000),
    joinDate: Date.now() - Math.floor(random(8) * 90 * 86400000),
    lastActiveAt: Date.now() - Math.floor(random(9) * 3600000),
    rank: Math.floor(random(10) * 1000 + 1),
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

    const stats = generateUserStats(pubkey)

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        "Cache-Control": "max-age=30, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[user-stats] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch user stats", 500, { message })
  }
}
