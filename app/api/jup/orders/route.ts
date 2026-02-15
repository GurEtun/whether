import { type NextRequest, NextResponse } from "next/server"
import { upstreamFetch, handleOptions, getCorsHeaders, errorResponse } from "@/lib/jup-client"

export async function GET(req: NextRequest) {
  try {
    const response = await upstreamFetch("/prediction/v1/orders", req)
    if (!response.ok) return errorResponse("Orders API error", response.status)
    const data = await response.json()
    return NextResponse.json(data, { headers: getCorsHeaders() })
  } catch (e) {
    return errorResponse("Failed to fetch orders", 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const response = await upstreamFetch("/prediction/v1/orders", req, { method: "POST" })
    if (!response.ok) return errorResponse("Orders API error", response.status)
    const data = await response.json()
    return NextResponse.json(data, { headers: getCorsHeaders() })
  } catch (e) {
    return errorResponse("Failed to create order", 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const response = await upstreamFetch("/prediction/v1/orders", req, { method: "DELETE" })
    if (!response.ok) return errorResponse("Orders API error", response.status)
    const data = await response.json()
    return NextResponse.json(data, { headers: getCorsHeaders() })
  } catch (e) {
    return errorResponse("Failed to delete orders", 500)
  }
}

export async function OPTIONS() {
  return handleOptions()
}
