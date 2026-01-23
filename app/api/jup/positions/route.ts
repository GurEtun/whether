import { NextResponse } from "next/server"
import { jupiterFetch, getCorsHeaders, errorResponse } from "@/lib/jup-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pubkey = searchParams.get("pubkey")
    
    if (!pubkey) {
      return errorResponse("pubkey is required", 400)
    }
    
    const data = await jupiterFetch(`/v1/positions/${pubkey}`)
    return NextResponse.json(data, { headers: getCorsHeaders() })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch positions", 500, { message })
  }
}
