import { type NextRequest } from "next/server"
import { upstreamFetch, handleOptions } from "@/lib/jup-client"

export async function GET(req: NextRequest) {
  return upstreamFetch("/api/v1/orders", req)
}

export async function POST(req: NextRequest) {
  return upstreamFetch("/api/v1/orders", req, { method: "POST" })
}

export async function DELETE(req: NextRequest) {
  return upstreamFetch("/api/v1/orders", req, { method: "DELETE" })
}

export async function OPTIONS() {
  return handleOptions()
}
