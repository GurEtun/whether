import { type NextRequest } from "next/server"
import { upstreamFetch, handleOptions } from "@/lib/jup-client"

export async function GET(req: NextRequest) {
  return upstreamFetch("/api/v1/events", req)
}

export async function OPTIONS() {
  return handleOptions()
}
