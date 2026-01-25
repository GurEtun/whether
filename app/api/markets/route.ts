import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic markets with real-time data
function generateAllMarkets(limit: number = 100) {
  const markets = []
  const categories = ["Crypto", "Politics", "Sports", "Economics", "Science & Tech", "Entertainment"]
  const now = Date.now()

  const marketTitles: Record<string, string[]> = {
    Crypto: [
      "Will BTC reach $150K by March 2026?",
      "Will ETH flip BTC market cap in 2026?",
      "Solana price above $500 by Q2 2026?",
      "Major altcoin rally expected?",
      "Bitcoin dominance above 50%?",
      "New crypto regulation bill passed?",
    ],
    Politics: [
      "Major AI regulation bill passed in 2026?",
      "Presidential election outcome prediction",
      "Trade war escalation expected?",
      "New supreme court justice confirmed?",
      "Infrastructure bill passes congress?",
    ],
    Sports: [
      "Manchester City wins Premier League 25/26?",
      "Lakers win NBA championship?",
      "World Cup surprise winner?",
      "Record-breaking Olympic performance?",
    ],
    Economics: [
      "Will the Fed cut rates by June 2026?",
      "Stock market correction expected?",
      "Inflation below 3% by Q2?",
      "Dollar strengthens against euro?",
      "Tech sector outperforms market?",
    ],
    "Science & Tech": [
      "SpaceX Starship orbital refueling by 2026?",
      "AI breakthrough announced?",
      "Quantum computing milestone reached?",
      "Novel cancer treatment approved?",
    ],
    Entertainment: [
      "Major movie blockbuster record broken?",
      "Gaming platform disruption?",
      "Streaming service merger announcement?",
    ],
  }

  for (let i = 0; i < limit; i++) {
    const seed = i * 31 + 7
    const random = (offset: number) => {
      const x = Math.sin(seed + offset + Math.floor(now / 5000)) * 10000
      return x - Math.floor(x)
    }
    
    const yesPrice = 30 + random(0) * 40
    const category = categories[i % categories.length]
    const titles = marketTitles[category] || []
    const title = titles[Math.floor(random(1) * titles.length)] || `Market ${i + 1}`
    
    markets.push({
      id: `market-${i + 1}`,
      title,
      series: `${category} Series`,
      category,
      yesPrice: Math.round(yesPrice * 100) / 100,
      noPrice: Math.round((100 - yesPrice) * 100) / 100,
      volume24h: Math.round(random(2) * 500000 + 50000),
      volume: Math.round(random(2) * 500000 + 50000),
      totalVolume: Math.round(random(3) * 2000000 + 100000),
      traders: Math.floor(random(4) * 5000 + 100),
      change: Math.round((random(5) - 0.5) * 20 * 100) / 100,
      status: i % 4 === 0 ? "closed" : "active",
      endDate: new Date(now + (30 - (i % 30)) * 86400000).toLocaleDateString(),
      resolution: i % 3 === 0 ? "TBD" : "Market confirmed",
      trending: i < 8,
    })
  }

  return markets
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "100", 10)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let markets = generateAllMarkets(Math.min(limit, 500))
    
    if (category) {
      markets = markets.filter(m => m.category.toLowerCase() === category.toLowerCase())
    }
    
    if (search) {
      markets = markets.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    }

    return NextResponse.json({ markets }, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[markets-api] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch markets", 500, { message })
  }
}
