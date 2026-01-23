import { NextResponse } from "next/server"
import { jupiterFetch, getCorsHeaders, errorResponse } from "@/lib/jup-client"

export async function GET() {
  try {
    const data = await jupiterFetch("/v1/leaderboard")
    return NextResponse.json(data, { headers: getCorsHeaders() })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch leaderboard", 500, { message })
  }
}
