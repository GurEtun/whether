import { type NextRequest } from "next/server"
import { upstreamFetch, handleOptions } from "@/lib/jup-client"

export async function DELETE(req: NextRequest) {
  return upstreamFetch("/api/v1/orders/close-all", req, { method: "DELETE" })
}

export async function OPTIONS() {
  return handleOptions()
}
