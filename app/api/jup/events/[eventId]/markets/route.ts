import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic markets for an event
function generateEventMarkets(eventId: string, limit: number = 10) {
  const now = Date.now()
  const seed = eventId.split("-").reduce((acc, s) => acc + parseInt(s || "0", 10), 0)
  const markets = []

  const titles = [
    "Will the price exceed $50,000?",
    "Will we see a market rally?",
    "Is the trend bullish?",
    "Will volume increase by 20%?",
    "Market close above support?",
    "Breakout expected this week?",
    "Institutional interest high?",
    "Volatility spike likely?",
    "New ATH by end of quarter?",
    "Regulatory clarity expected?",
  ]

  for (let i = 0; i < limit; i++) {
    const random = (offset: number) => {
      const x = Math.sin(seed + offset + i) * 10000
      return x - Math.floor(x)
    }
    
    const yesPrice = 30 + random(0) * 40

    markets.push({
      id: `market-${eventId}-${i + 1}`,
      eventId,
      title: titles[i % titles.length],
      yesPrice: Math.round(yesPrice * 100) / 100,
      noPrice: Math.round((100 - yesPrice) * 100) / 100,
      volume: Math.round(random(1) * 100000 + 10000),
      traders: Math.floor(random(2) * 1000 + 50),
      status: i % 3 === 0 ? "closed" : "active",
      endDate: new Date(now + (30 - i) * 86400000).toLocaleDateString(),
    })
  }

  return markets
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    
    const markets = generateEventMarkets(eventId, Math.min(limit, 50))

    return NextResponse.json({ markets }, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[jup-event-markets] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch event markets", 500, { message })
  }
}
