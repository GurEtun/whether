import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"
import { tradingEngine } from "@/lib/trading-engine"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderPubkey: string }> }
) {
  try {
    const { orderPubkey } = await params

    // Check local trading engine first
    const order = tradingEngine.getOrder(orderPubkey)
    
    if (order) {
      return NextResponse.json(
        {
          pubkey: orderPubkey,
          status: order.status,
          outcome: order.outcome,
          shares: order.shares,
          filledPrice: order.filledPrice,
          totalCost: order.totalCost,
          timestamp: order.timestamp,
          orderId: order.orderId,
        },
        {
          status: 200,
          headers: {
            ...getCorsHeaders(),
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      )
    }

    // If not found, return 404
    return errorResponse("Order not found", 404, { orderPubkey })
  } catch (error) {
    console.error("[order-status] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to fetch order status", 500, { message })
  }
}

export async function OPTIONS() {
  return handleOptions()
}
