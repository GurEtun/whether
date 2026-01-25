import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Generate mock event detail
function generateEventDetail(eventId: string) {
  const eventCategories = ["Crypto", "Politics", "Sports", "Economics", "Science & Tech", "Entertainment"]
  const now = Date.now()
  const idx = parseInt(eventId.split("-")[1] || "0", 10) % eventCategories.length
  
  return {
    id: eventId,
    title: `${eventCategories[idx]} Event Details`,
    description: `Major ${eventCategories[idx].toLowerCase()} event with comprehensive market coverage and real-time updates.`,
    category: eventCategories[idx],
    status: "active",
    startDate: now - 86400000,
    endDate: now + 30 * 86400000,
    marketCount: 8,
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
