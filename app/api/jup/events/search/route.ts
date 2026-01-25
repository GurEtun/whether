import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate realistic events data
function generateEvents(limit: number = 20) {
  const eventCategories = ["Crypto", "Politics", "Sports", "Economics", "Science & Tech", "Entertainment"]
  const events = []

  for (let i = 0; i < limit; i++) {
    const now = Date.now()
    const category = eventCategories[i % eventCategories.length]
    
    events.push({
      id: `event-${i + 1}`,
      title: `${category} Event ${i + 1}`,
      description: `Major ${category.toLowerCase()} event with multiple prediction markets`,
      category,
      status: i % 3 === 0 ? "closed" : i % 2 === 0 ? "active" : "pending",
      startDate: now - i * 86400000,
      endDate: now + (30 - i) * 86400000,
      marketCount: Math.floor(Math.random() * 10) + 3,
      volume: Math.round(Math.random() * 500000 + 50000),
    })
  }

  return events
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query")
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    
    if (!query) {
      return errorResponse("Missing required query parameter: query", 400)
    }

    let events = generateEvents(Math.min(limit, 100))
    
    // Filter by search query
    events = events.filter(e => 
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.description.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({ events }, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[jup-events-search] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to search events", 500, { message })
  }
}
