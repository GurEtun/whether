import { type NextRequest } from "next/server"
import { upstreamFetch, handleOptions } from "@/lib/jup-client"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> }
) {
  const { marketId } = await params
  return upstreamFetch(`/api/v1/markets/${marketId}`, req)
}

export async function OPTIONS() {
  return handleOptions()
}
