import { NextResponse } from "next/server"

const METADATA_API_BASE_URL = "https://prediction-markets-api.dflow.net"

// Fallback events data when API is unavailable
// IDs must match the static markets-data.ts file
const FALLBACK_EVENTS = {
  events: [
    {
      id: "btc-150k",
      title: "Will BTC reach $150K by March 2026?",
      description: "This market will resolve to Yes if Bitcoin (BTC) reaches or exceeds $150,000 USD at any point before March 31, 2026 23:59:59 UTC according to CoinGecko.",
      category: "Crypto",
      status: "active",
      endTime: "2026-03-31T23:59:59Z",
      markets: [{ id: "btc-150k-market", accounts: { yesMint: "yes1", noMint: "no1" } }],
    },
    {
      id: "fed-rate-cut",
      title: "Will the Fed cut rates by June 2026?",
      description: "This market will resolve to Yes if the Federal Reserve cuts interest rates by at least 25 basis points before June 15, 2026 according to official FOMC announcements.",
      category: "Economics",
      status: "active",
      endTime: "2026-06-15T23:59:59Z",
      markets: [{ id: "fed-rate-cut-market", accounts: { yesMint: "yes2", noMint: "no2" } }],
    },
    {
      id: "eth-flip",
      title: "Will ETH flip BTC market cap in 2026?",
      description: "This market will resolve to Yes if Ethereum's market capitalization exceeds Bitcoin's market capitalization at any point in 2026 according to CoinGecko data.",
      category: "Crypto",
      status: "active",
      endTime: "2026-12-31T23:59:59Z",
      markets: [{ id: "eth-flip-market", accounts: { yesMint: "yes3", noMint: "no3" } }],
    },
    {
      id: "ai-regulation",
      title: "Major AI regulation bill passed in 2026?",
      description: "This market will resolve to Yes if a major federal AI regulation bill is signed into law in the United States before December 31, 2026.",
      category: "Politics",
      status: "active",
      endTime: "2026-12-31T23:59:59Z",
      markets: [{ id: "ai-reg-market", accounts: { yesMint: "yes4", noMint: "no4" } }],
    },
    {
      id: "starship-orbital",
      title: "SpaceX Starship orbital refueling by 2026?",
      description: "This market will resolve to Yes if SpaceX successfully completes an orbital refueling test with Starship before December 31, 2026 as confirmed by official SpaceX or NASA announcements.",
      category: "Science & Tech",
      status: "active",
      endTime: "2026-12-31T23:59:59Z",
      markets: [{ id: "starship-market", accounts: { yesMint: "yes5", noMint: "no5" } }],
    },
    {
      id: "man-city-premier",
      title: "Manchester City wins Premier League 25/26?",
      description: "This market will resolve to Yes if Manchester City wins the 2025/26 Premier League title as determined by final league standings.",
      category: "Sports",
      status: "active",
      endTime: "2026-05-25T23:59:59Z",
      markets: [{ id: "man-city-market", accounts: { yesMint: "yes6", noMint: "no6" } }],
    },
  ],
}

export async function GET() {
  // Always return fallback data for now
  // The DFlow API requires domain allowlisting which isn't available in preview environments
  // When deployed to production with a proper domain, this can be updated to call the real API
  return NextResponse.json(FALLBACK_EVENTS)
}
