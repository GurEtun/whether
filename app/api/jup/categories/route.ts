import { jupClient } from "@/lib/jup-client"

export async function GET(request: Request) {
  return jupClient.get("/categories", request)
}
