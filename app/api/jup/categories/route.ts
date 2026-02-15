import { NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

// Categories from Jupiter Prediction API
const MARKET_CATEGORIES = [
  "all",
  "crypto",
  "sports",
  "politics",
  "esports",
  "culture",
  "economics",
  "tech",
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { categories: MARKET_CATEGORIES },
      {
        status: 200,
        headers: {
          ...getCorsHeaders(),
          "Cache-Control": "max-age=3600, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[categories] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch categories", 500, { message })
  }
}
