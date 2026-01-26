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
    if (!body.marketId || typeof body.marketId !== 'string' || body.marketId.trim() === '') {
      return errorResponse("Missing or invalid marketId", 400)
    }

    if (!body.outcome || !["yes", "no"].includes(body.outcome)) {
      return errorResponse("Invalid or missing outcome (must be 'yes' or 'no')", 400)
    }

    if (typeof body.shares !== 'number' || body.shares <= 0) {
      return errorResponse("Shares must be a positive number", 400)
    }

    if (body.shares > 1000000) {
      return errorResponse("Shares exceed maximum limit of 1,000,000", 400)
    }

    if (body.priceLimit !== undefined && (body.priceLimit < 1 || body.priceLimit > 99)) {
      return errorResponse("Price limit must be between 1 and 99", 400)
    }

    if (body.slippage !== undefined && (body.slippage < 0 || body.slippage > 10)) {
      return errorResponse("Slippage must be between 0 and 10", 400)
    }

    // Execute trade
    const result = tradingEngine.executeMarketTrade(body)

    // Validate result before returning
    if (!result || result.success === false) {
      return errorResponse("Trade execution failed", 500, { orderId: result?.orderId })
    }

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
