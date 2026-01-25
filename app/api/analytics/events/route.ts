import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const eventType = searchParams.get("type")
    const limit = parseInt(searchParams.get("limit") || "50", 10)

    const now = Date.now()
    const eventTypes = ["price_update", "trade", "liquidity", "volume_spike"]
    
    let events = Array.from({ length: Math.min(limit, 100) }, (_, i) => ({
      id: `event-${i + 1}`,
      marketId: `market-${Math.floor(Math.random() * 100) + 1}`,
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      timestamp: now - i * 120000,
      data: {
        price: Math.round((30 + Math.random() * 40) * 100) / 100,
        volume: Math.round(Math.random() * 100000 + 10000),
        traders: Math.floor(Math.random() * 1000 + 10),
      },
    }))

    if (eventType) {
      events = events.filter(e => e.type === eventType)
    }

    return NextResponse.json(
      { events, total: events.length },
      {
        status: 200,
        headers: {
          ...getCorsHeaders(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[events-api] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch events", events: [] },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}
