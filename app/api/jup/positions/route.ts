import { jupClient } from "@/lib/jup-client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pubkey = searchParams.get("pubkey")
  
  if (!pubkey) {
    return NextResponse.json({ error: "pubkey is required" }, { status: 400 })
  }
  
  return jupClient.get(`/positions/${pubkey}`, request)
}
