import { NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"
import { tradingEngine, type TradeExecutionRequest } from "@/lib/trading-engine"

export async function OPTIONS() {
  return handleOptions()
}

export async function POST(req: NextRequest) {
  try {
    const body: TradeExecutionRequest = await req.json()

    // Validate request
    if (!body.marketId || !body.outcome || !body.shares) {
      return errorResponse("Missing required fields", 400)
    }

    if (body.shares <= 0) {
      return errorResponse("Shares must be positive", 400)
    }

    if (!["yes", "no"].includes(body.outcome)) {
      return errorResponse("Invalid outcome", 400)
    }

    // Execute trade
    const result = tradingEngine.executeMarketTrade(body)

    return NextResponse.json(result, {
      status: 200,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error("[trade-execute] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Trade execution failed", 500, { message })
  }
}
