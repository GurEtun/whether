import { NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

const MARKET_TAGS = [
  "trending",
  "high-volume",
  "new",
  "resolved",
  "closing-soon",
  "high-liquidity",
  "featured",
  "ai-powered",
  "community-favorite",
  "verified",
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { tags: MARKET_TAGS },
      {
        status: 200,
        headers: {
          ...getCorsHeaders(),
          "Cache-Control": "max-age=3600, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[tags] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch tags", 500, { message })
  }
}
