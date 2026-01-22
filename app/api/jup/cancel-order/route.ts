import { jupClient } from "@/lib/jup-client"

export async function POST(request: Request) {
  const body = await request.json()
  return jupClient.post("/cancel-order", body, request)
}
