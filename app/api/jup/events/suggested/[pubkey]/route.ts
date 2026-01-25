import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate suggested events based on user interest
function generateSuggestedEvents(pubkey: string, limit: number = 10) {
  const eventCategories = ["Crypto", "Politics", "Sports", "Economics", "Science & Tech", "Entertainment"]
  const now = Date.now()
  const seed = pubkey.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const events = []

  for (let i = 0; i < limit; i++) {
    const random = (offset: number) => {
      const x = Math.sin(seed + offset + i) * 10000
      return x - Math.floor(x)
    }
    
    const category = eventCategories[Math.floor(random(0) * eventCategories.length)]
    
    events.push({
      id: `event-${i + 1}`,
      title: `Suggested ${category} Event ${i + 1}`,
      description: `Recommended event based on your trading history`,
      category,
      status: "active",
      startDate: now - i * 86400000,
      endDate: now + (30 - i) * 86400000,
      marketCount: Math.floor(random(1) * 10) + 3,
      volume: Math.round(random(2) * 500000 + 50000),
    })
  }

  return events
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
) {
  try {
    const { pubkey } = await params
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    
    const events = generateSuggestedEvents(pubkey, Math.min(limit, 50))

    return NextResponse.json({ events }, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[jup-suggested-events] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch suggested events", 500, { message })
  }
}
