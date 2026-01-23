import { NextResponse } from "next/server"
import { jupiterFetch, getCorsHeaders, errorResponse } from "@/lib/jup-client"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ pubkey: string }> }
) {
  try {
    const { pubkey } = await params
    const data = await jupiterFetch(`/v1/positions/${pubkey}`)
    return NextResponse.json(data, { headers: getCorsHeaders() })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch position", 500, { message })
  }
}
