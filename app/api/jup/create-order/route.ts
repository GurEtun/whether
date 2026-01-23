import { NextResponse } from "next/server"
import { jupiterFetch, getCorsHeaders, errorResponse } from "@/lib/jup-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await jupiterFetch("/v1/create-order", {
      method: "POST",
      body,
    })
    return NextResponse.json(data, { headers: getCorsHeaders() })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return errorResponse("Failed to create order", 500, { message })
  }
}
