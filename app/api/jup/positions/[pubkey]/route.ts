import { jupClient } from "@/lib/jup-client"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ pubkey: string }> }
) {
  const { pubkey } = await params
  return jupClient.get(`/positions/${pubkey}`, request)
}
