import { type NextRequest, NextResponse } from "next/server"
import { upstreamFetch, handleOptions, getCorsHeaders, errorResponse } from "@/lib/jup-client"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderPubkey: string }> }
) {
  try {
    const { orderPubkey } = await params
    const response = await upstreamFetch(`/prediction/v1/orders/${orderPubkey}`)
    if (!response.ok) return errorResponse("Order not found", response.status)
    const data = await response.json()
    return NextResponse.json(data, { headers: getCorsHeaders() })
  } catch (e) {
    return errorResponse("Failed to fetch order", 500)
  }
}

export async function OPTIONS() {
  return handleOptions()
}
