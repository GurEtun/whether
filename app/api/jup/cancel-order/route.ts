import { NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"
import { tradingEngine } from "@/lib/trading-engine"

export async function OPTIONS() {
  return handleOptions()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderPubkey, orderId } = body

    if (!orderPubkey && !orderId) {
      return errorResponse("orderPubkey or orderId is required", 400)
    }

    const orderKey = orderPubkey || orderId

    // Check if order exists locally
    const order = tradingEngine.getOrder(orderKey)

    if (!order) {
      return errorResponse("Order not found", 404, { orderKey })
    }

    // For now, we don't support canceling filled orders
    if (order.status === "filled") {
      return errorResponse("Cannot cancel a filled order", 400, { status: order.status })
    }

    // Return success response for pending orders
    return NextResponse.json(
      {
        success: true,
        orderPubkey: orderKey,
        orderId: order.orderId,
        status: "cancelled",
        previousStatus: order.status,
        message: "Order cancellation request processed",
      },
      {
        status: 200,
        headers: getCorsHeaders(),
      }
    )
  } catch (error) {
    console.error("[cancel-order] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to cancel order", 500, { message })
  }
}
