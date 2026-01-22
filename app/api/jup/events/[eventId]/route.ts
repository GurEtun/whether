import { type NextRequest } from "next/server"
import { upstreamFetch, handleOptions } from "@/lib/jup-client"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params
  return upstreamFetch(`/api/v1/events/${eventId}`, req)
}

export async function OPTIONS() {
  return handleOptions()
}
