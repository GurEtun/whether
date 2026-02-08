import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic events data with proper titles
function generateEvents(limit: number = 20) {
  const eventsByCategory = {
    "Crypto": [
      "Bitcoin Price Predictions Q1 2026",
      "Ethereum ETF Approval Timeline",
      "Solana Network Performance Milestones",
      "DeFi Protocol TVL Predictions",
    ],
    "Politics": [
      "US Midterm Election Outcomes 2026",
      "Federal Reserve Rate Decision",
      "Climate Legislation Progress",
      "Tech Regulation Developments",
    ],
    "Sports": [
      "Super Bowl LXI Winner",
      "NBA Championship 2026",
      "Premier League Season Predictions",
      "FIFA World Cup Qualifiers",
    ],
    "Economics": [
      "S&P 500 Year-End Target",
      "Inflation Rate Predictions",
      "Housing Market Trends",
      "Tech Stock Performance",
    ],
    "Science & Tech": [
      "AI Model Capabilities Milestones",
      "SpaceX Mission Success",
      "Apple Product Launch Predictions",
      "Quantum Computing Breakthroughs",
    ],
    "Entertainment": [
      "Oscar Winners 2027",
      "Box Office Record Predictions",
      "Streaming Service Subscriber Counts",
      "Music Awards Predictions",
    ],
  }

  const events = []
  const categories = Object.keys(eventsByCategory)
  const now = Date.now()

  for (let i = 0; i < limit; i++) {
    const category = categories[i % categories.length]
    const titles = eventsByCategory[category as keyof typeof eventsByCategory]
    const title = titles[Math.floor(i / categories.length) % titles.length]
    
    events.push({
      id: `event-${i + 1}`,
      title: title,
      description: `Prediction markets for ${title.toLowerCase()} with multiple outcome options`,
      category,
      status: i % 4 === 0 ? "closed" : "active",
      startDate: now - i * 86400000,
      endDate: now + (30 - i) * 86400000,
      marketCount: Math.floor(Math.random() * 5) + 3,
      volume: Math.round(Math.random() * 500000 + 50000),
    })
  }

  return events
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const category = searchParams.get("category")

    let events = generateEvents(Math.min(limit, 100))
    
    if (category) {
      events = events.filter(e => e.category.toLowerCase() === category.toLowerCase())
    }

    return NextResponse.json({ events }, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[jup-events] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch events", 500, { message })
  }
}
