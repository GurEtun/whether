import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic markets for an event based on event type
function generateEventMarkets(eventId: string, limit: number = 10) {
  const now = Date.now()
  const seed = eventId.split("-").reduce((acc, s) => acc + parseInt(s || "0", 10), 0)
  const markets = []

  // Different market questions based on event ID pattern
  const marketTemplatesByType = {
    crypto: [
      "Will BTC exceed $100,000?",
      "Will ETH reach $5,000?",
      "Will SOL hit $300?",
      "New all-time high this quarter?",
      "Institutional adoption increases?",
    ],
    politics: [
      "Will legislation pass?",
      "Voter turnout exceeds 60%?",
      "Policy implementation by Q2?",
      "Approval rating above 50%?",
      "International agreement reached?",
    ],
    sports: [
      "Team wins championship?",
      "Player wins MVP?",
      "Record broken this season?",
      "Playoff qualification?",
      "Coach of the year award?",
    ],
    economics: [
      "Rate cut by Fed?",
      "Index reaches new high?",
      "Unemployment below 4%?",
      "GDP growth exceeds 3%?",
      "Market correction occurs?",
    ],
    tech: [
      "Product launch successful?",
      "Feature release by deadline?",
      "User milestone reached?",
      "Market share increases?",
      "Partnership announced?",
    ],
    entertainment: [
      "Award nomination received?",
      "Box office exceeds $500M?",
      "Critical acclaim achieved?",
      "Sequel greenlit?",
      "Streaming record broken?",
    ],
  }

  // Determine type from seed
  const types = Object.keys(marketTemplatesByType)
  const typeIndex = seed % types.length
  const type = types[typeIndex] as keyof typeof marketTemplatesByType
  const templates = marketTemplatesByType[type]

  for (let i = 0; i < limit; i++) {
    const random = (offset: number) => {
      const x = Math.sin(seed + offset + i) * 10000
      return x - Math.floor(x)
    }
    
    const yesPrice = 25 + random(0) * 50

    markets.push({
      id: `market-${eventId}-${i + 1}`,
      eventId,
      title: templates[i % templates.length],
      yesPrice: Math.round(yesPrice * 100) / 100,
      noPrice: Math.round((100 - yesPrice) * 100) / 100,
      volume: Math.round(random(1) * 100000 + 10000),
      traders: Math.floor(random(2) * 1000 + 50),
      status: i % 5 === 0 ? "closed" : "active",
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
