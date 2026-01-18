import { NextResponse } from "next/server"

const METADATA_API_BASE_URL = "https://prediction-markets-api.dflow.net"

// Fallback events data when API is unavailable
const FALLBACK_EVENTS = {
  events: [
    {
      id: "btc-150k",
      title: "Will BTC reach $150K by end of 2026?",
      description: "This market resolves YES if Bitcoin reaches $150,000 USD on any major exchange before December 31, 2026.",
      category: "Crypto",
      status: "active",
      endTime: "2026-12-31T23:59:59Z",
      markets: [{ id: "btc-150k-market", accounts: { yesMint: "yes1", noMint: "no1" } }],
    },
    {
      id: "fed-rates-2026",
      title: "Will the Fed cut rates by June 2026?",
      description: "Resolves YES if the Federal Reserve announces a rate cut before July 1, 2026.",
      category: "Economics",
      status: "active",
      endTime: "2026-06-30T23:59:59Z",
      markets: [{ id: "fed-rates-market", accounts: { yesMint: "yes2", noMint: "no2" } }],
    },
    {
      id: "eth-flip-btc",
      title: "Will ETH flip BTC market cap in 2026?",
      description: "Resolves YES if Ethereum's market cap exceeds Bitcoin's at any point in 2026.",
      category: "Crypto",
      status: "active",
      endTime: "2026-12-31T23:59:59Z",
      markets: [{ id: "eth-flip-market", accounts: { yesMint: "yes3", noMint: "no3" } }],
    },
    {
      id: "ai-regulation-2026",
      title: "Will there be a major AI regulation bill passed in 2026?",
      description: "Resolves YES if a comprehensive AI regulation bill is signed into law in the US in 2026.",
      category: "Politics",
      status: "active",
      endTime: "2026-12-31T23:59:59Z",
      markets: [{ id: "ai-reg-market", accounts: { yesMint: "yes4", noMint: "no4" } }],
    },
    {
      id: "spacex-starship",
      title: "Will SpaceX Starship complete orbital refueling by 2026?",
      description: "Resolves YES if SpaceX successfully demonstrates orbital refueling with Starship before end of 2026.",
      category: "Science & Tech",
      status: "active",
      endTime: "2026-12-31T23:59:59Z",
      markets: [{ id: "spacex-market", accounts: { yesMint: "yes5", noMint: "no5" } }],
    },
    {
      id: "man-city-pl-2526",
      title: "Will Manchester City win the Premier League 25/26?",
      description: "Resolves YES if Manchester City wins the 2025/26 Premier League season.",
      category: "Sports",
      status: "active",
      endTime: "2026-05-25T23:59:59Z",
      markets: [{ id: "man-city-market", accounts: { yesMint: "yes6", noMint: "no6" } }],
    },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || "active"
  const limit = searchParams.get("limit") || "200"
  
  // Check if we're in a preview/development environment
  const host = request.headers.get("host") || ""
  const isPreview = host.includes("vusercontent.net") || 
                    host.includes("v0.dev") || 
                    host.includes("localhost") ||
                    host.includes("vercel.app")
  
  // In preview environments, skip the API call and return fallback directly
  if (isPreview) {
    return NextResponse.json(FALLBACK_EVENTS)
  }

  try {
    const params = new URLSearchParams()
    params.append("withNestedMarkets", "true")
    params.append("status", status)
    params.append("limit", limit)

    const response = await fetch(
      `${METADATA_API_BASE_URL}/api/v1/events?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Whether-Prediction-Market/1.0",
        },
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) {
      return NextResponse.json(FALLBACK_EVENTS)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(FALLBACK_EVENTS)
  }
}
