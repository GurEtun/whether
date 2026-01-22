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
    const limit = searchParams.get("limit") || "50"
    
    // Fetch recent trades from Jupiter
    const data = await jupiterFetch<{
      trades: Array<{
        id: string
        price: number
        size: number
        side: "buy" | "sell"
        outcome: "yes" | "no"
        timestamp: number
        trader?: string
      }>
    }>(`/v1/markets/${marketId}/trades`, {
      params: { limit }
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
    return errorResponse("Failed to fetch trades", 500, { message })
  }
}
