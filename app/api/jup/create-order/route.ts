import { NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"
import { tradingEngine, type TradeExecutionRequest } from "@/lib/trading-engine"

export async function OPTIONS() {
  return handleOptions()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.marketId || typeof body.marketId !== 'string') {
      return errorResponse("marketId is required and must be a string", 400)
    }

    if (!body.outcome || !["yes", "no"].includes(body.outcome)) {
      return errorResponse("outcome is required and must be 'yes' or 'no'", 400)
    }

    if (typeof body.shares !== 'number' || body.shares <= 0) {
      return errorResponse("shares must be a positive number", 400)
    }

    // Create trade execution request
    const tradeRequest: TradeExecutionRequest = {
      marketId: body.marketId,
      outcome: body.outcome,
      shares: body.shares,
      priceLimit: body.priceLimit,
      userAddress: body.userAddress,
      slippage: body.slippage,
      side: body.side || "buy",
    }

    // Execute the trade
    const result = tradingEngine.executeMarketTrade(tradeRequest)

    return NextResponse.json(
      {
        ...result,
        pubkey: result.orderId,
      },
      {
        status: result.success ? 200 : 400,
        headers: getCorsHeaders(),
      }
    )
  } catch (error) {
    console.error("[create-order] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to create order", 500, { message })
  }
}
