import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

export async function GET(req: NextRequest) {
  try {
    const now = Date.now()
    const categories = ["Crypto", "Politics", "Sports", "Economics", "Science & Tech", "Entertainment"]
    
    const stats = {
      totalVolume24h: Math.round(Math.random() * 50000000 + 1000000),
      totalTrades24h: Math.floor(Math.random() * 100000 + 10000),
      uniqueTraders: Math.floor(Math.random() * 50000 + 5000),
      activeMarkets: Math.floor(Math.random() * 500 + 100),
      averageVolatility: Math.round((10 + Math.random() * 20) * 100) / 100,
      topCategories: categories.slice(0, 3).map(cat => ({
        category: cat,
        volume: Math.round(Math.random() * 5000000 + 100000),
        markets: Math.floor(Math.random() * 50 + 5),
      })),
      recentEvents: Array.from({ length: 10 }, (_, i) => ({
        id: `event-${i + 1}`,
        type: ["price_update", "trade", "volume_spike"][Math.floor(Math.random() * 3)],
        timestamp: now - i * 60000,
        description: `Market activity event ${i + 1}`,
      })),
      timestamp: now,
    }

    return NextResponse.json(stats, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[global-analytics] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch global analytics" },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}
