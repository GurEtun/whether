import { NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate leaderboard data
function generateLeaderboard(limit: number = 50) {
  const entries = []

  for (let i = 0; i < limit; i++) {
    const random = (offset: number) => {
      const x = Math.sin(i + offset) * 10000
      return x - Math.floor(x)
    }

    entries.push({
      rank: i + 1,
      address: `${Math.random().toString(36).substr(2, 6)}...${Math.random().toString(36).substr(2, 4)}`,
      username: `Trader${Math.floor(Math.random() * 10000)}`,
      totalVolume: Math.round(random(0) * 5000000 + 10000),
      winRate: Math.round(random(1) * 100 * 100) / 100,
      trades: Math.floor(random(2) * 1000 + 10),
      profit: Math.round((random(3) - 0.5) * 100000),
      profitPercent: Math.round((random(4) - 0.5) * 500 * 100) / 100,
      timestamp: Date.now(),
    })
  }

  return entries.sort((a, b) => b.profit - a.profit)
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100)

    const leaderboard = generateLeaderboard(limit)

    return NextResponse.json(
      { leaderboard },
      {
        status: 200,
        headers: {
          ...getCorsHeaders(),
          "Cache-Control": "max-age=60, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[leaderboard] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch leaderboard", 500, { message })
  }
}
