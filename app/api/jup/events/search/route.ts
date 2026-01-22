import { type NextRequest } from "next/server"
import { upstreamFetch, handleOptions, errorResponse } from "@/lib/jup-client"

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query")
  
  if (!query) {
    return errorResponse("Missing required query parameter: query", 400)
  }
  
  return upstreamFetch("/api/v1/events/search", req)
}

export async function OPTIONS() {
  return handleOptions()
}
