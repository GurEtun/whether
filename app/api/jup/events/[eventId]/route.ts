import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate mock event detail matching the events list
function generateEventDetail(eventId: string) {
  const eventsByCategory = {
    "Crypto": "Bitcoin Price Predictions Q1 2026",
    "Politics": "US Midterm Election Outcomes 2026",
    "Sports": "Super Bowl LXI Winner",
    "Economics": "S&P 500 Year-End Target",
    "Science & Tech": "AI Model Capabilities Milestones",
    "Entertainment": "Oscar Winners 2027",
  }
  
  const eventCategories = Object.keys(eventsByCategory)
  const now = Date.now()
  const eventNum = parseInt(eventId.split("-")[1] || "1", 10)
  const idx = (eventNum - 1) % eventCategories.length
  const category = eventCategories[idx]
  const title = eventsByCategory[category as keyof typeof eventsByCategory]
  
  return {
    id: eventId,
    title: title,
    description: `Prediction markets for ${title.toLowerCase()} with multiple outcome options`,
    category: category,
    status: eventNum % 4 === 0 ? "closed" : "active",
    startDate: now - eventNum * 86400000,
    endDate: now + (30 - eventNum) * 86400000,
    startTime: new Date(now - eventNum * 86400000).toISOString(),
    endTime: new Date(now + (30 - eventNum) * 86400000).toISOString(),
    marketCount: Math.floor(Math.random() * 5) + 3,
    volume: Math.round(Math.random() * 500000 + 50000),
    traders: Math.floor(Math.random() * 5000 + 100),
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const event = generateEventDetail(eventId)

    return NextResponse.json(event, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[jup-event-detail] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch event", 500, { message })
  }
}
