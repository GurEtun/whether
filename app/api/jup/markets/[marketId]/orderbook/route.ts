import { type NextRequest, NextResponse } from "next/server"
import { jupiterFetch, getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function OPTIONS() {
  return handleOptions()
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  try {
    const { marketId } = await params
    const searchParams = req.nextUrl.searchParams
    const depth = searchParams.get("depth") || "10"
    
    // Fetch orderbook from Jupiter
    const data = await jupiterFetch<{
      bids: Array<{ price: number; size: number }>
      asks: Array<{ price: number; size: number }>
      spread: number
    }>(`/v1/markets/${marketId}/orderbook`, {
      params: { depth }
    })
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch orderbook", 500, { message })
  }
}
