import { type NextRequest, NextResponse } from "next/server"
import { getCorsHeaders, errorResponse, handleOptions } from "@/lib/jup-client"

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const pubkey = searchParams.get("pubkey")
    const marketId = searchParams.get("marketId")

    if (!pubkey && !marketId) {
      return errorResponse("pubkey or marketId is required", 400)
    }

    // Mock response for closing all orders
    return NextResponse.json(
      {
        success: true,
        message: `All orders closed for ${pubkey || marketId}`,
        ordersClosed: Math.floor(Math.random() * 10) + 1,
        timestamp: Date.now(),
      },
      {
        status: 200,
        headers: getCorsHeaders(),
      }
    )
  } catch (error) {
    console.error("[close-all-orders] Error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to close all orders", 500, { message })
  }
}

export async function OPTIONS() {
  return handleOptions()
}
