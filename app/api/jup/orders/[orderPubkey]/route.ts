import { type NextRequest } from "next/server"
import { upstreamFetch, handleOptions } from "@/lib/jup-client"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderPubkey: string }> }
) {
  const { orderPubkey } = await params
  return upstreamFetch(`/api/v1/orders/${orderPubkey}`, req)
}

export async function OPTIONS() {
  return handleOptions()
}
