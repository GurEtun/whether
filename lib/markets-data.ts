export type Market = {
  id: string
  title: string
  category: string
  series: string
  description: string
  yesPrice: number
  noPrice: number
  change: number
  volume: string
  totalVolume: string
  traders: number
  endDate: string
  resolution: string
  created: string
  status: "active" | "closed" | "determined" | "finalized"
  trending?: boolean
  eventName: string
}

// Generate market data dynamically to show many real markets
function generateMarkets(): Market[] {
  const markets: Market[] = []
  const categories = ["Crypto", "Politics", "Sports", "Economics", "Science & Tech", "Entertainment"]
  const statuses: Array<"active" | "closed" | "determined" | "finalized"> = ["active", "active", "closed", "determined"]
  
  // Crypto markets
  const cryptoTitles = [
    "Will BTC reach $150K by March 2026?",
    "Will ETH flip BTC market cap in 2026?",
    "Will Solana reach $500 by Q2 2026?",
    "Will Dogecoin reach $1 by end of 2026?",
    "Will XRP settle SEC lawsuit favorably by Q2 2026?",
    "Will Bitcoin spot ETF inflows exceed $50B by June?",
    "Will Polygon (MATIC) reach $3 by end of 2026?",
    "Will Cardano's AUM exceed $100B by Dec 2026?",
    "Will Arbitrum surpass Optimism in TVL?",
    "Will Base surpass Solana in daily transactions?",
    "Will BTC dominance drop below 40% by Q4 2026?",
    "Will Ethereum 2.0 staking rewards exceed $10B?",
    "Will Chainlink adoption triple in 2026?",
    "Will Polygon ZK scaling go mainstream by Q3?",
    "Will Cosmos (ATOM) hit $25 by December 2026?",
  ]
  
  // Politics markets
  const politicsTitles = [
    "Will there be a major AI regulation bill passed in 2026?",
    "Will the US pass cryptocurrency legislation by Q4 2026?",
    "Will sanctions on Russia increase by 50% in 2026?",
    "Will UK rejoin the EU customs union by 2027?",
    "Will carbon tax be implemented in the US by 2026?",
    "Will Taiwan be recognized by 5 more countries in 2026?",
    "Will China expand tech restrictions on US companies?",
    "Will a new Middle East peace agreement be signed?",
    "Will India become world's 2nd largest economy by 2026?",
    "Will renewable energy exceed 50% of US grid by 2026?",
  ]
  
  // Sports markets
  const sportsTitles = [
    "Will Manchester City win Premier League 25/26?",
    "Will Paris Saint-Germain win Champions League?",
    "Will Kansas City Chiefs win Super Bowl LXI?",
    "Will Golden State Warriors make NBA Finals 2026?",
    "Will England win Euro 2026?",
    "Will Argentina defend World Cup in 2026?",
    "Will Wimbledon repeat champion in 2026?",
    "Will LeBron James play past 2026-27 season?",
    "Will a rookie QB win MVP in 2026 season?",
    "Will Barcelona return to Champions League final?",
    "Will Real Madrid win La Liga 25/26?",
    "Will Liverpool FC win Premier League title?",
    "Will a female tennis player earn over $50M in 2026?",
    "Will an esports org become first sports unicorn?",
  ]
  
  // Economics markets
  const economicsTitles = [
    "Will the Fed cut rates by June 2026?",
    "Will US inflation stay below 3% in 2026?",
    "Will US unemployment exceed 5% by Q4 2026?",
    "Will S&P 500 reach 6500 by end of 2026?",
    "Will oil price exceed $100/barrel in 2026?",
    "Will housing starts exceed 1.5M in 2026?",
    "Will Gold reach $2500/oz by December 2026?",
    "Will Tesla stock reach $300 by end of 2026?",
    "Will Apple stock reach $250 by December 2026?",
    "Will US GDP growth exceed 3% in 2026?",
    "Will recession occur in 2026?",
    "Will interest rates rise by Q3 2026?",
    "Will Dollar strength exceed 2024 levels?",
    "Will credit card debt exceed $1.2T in 2026?",
  ]
  
  // Science & Tech markets
  const techTitles = [
    "Will GPT-5 be released by OpenAI by July 2026?",
    "Will SpaceX Starship complete orbital refueling?",
    "Will iPhone SE 4 be released by Q2 2026?",
    "Will quantum computing achieve quantum advantage?",
    "Will neural interface be FDA approved by 2026?",
    "Will AGI be achieved by end of 2026?",
    "Will robotics surpass $100B market by 2026?",
    "Will mRNA cancer vaccine be approved by FDA?",
    "Will commercial fusion power reach grid by 2026?",
    "Will autonomous vehicles exceed 10M cars by 2026?",
    "Will Apple release Vision Pro 2 by Q3?",
    "Will Meta achieve profitability in Metaverse?",
    "Will photosynthetic AI reach practical use?",
    "Will deepfake detection become mainstream?",
  ]
  
  // Entertainment markets
  const entertainmentTitles = [
    "Will Dune 3 win Best Picture at 2027 Oscars?",
    "Will Taylor Swift announce new album by Q2 2026?",
    "Will Avatar 4 exceed $2B at box office?",
    "Will Netflix lose 5M subscribers in 2026?",
    "Will a streaming service reach 500M subscribers?",
    "Will superhero movies dominate 2026 box office?",
    "Will K-pop surpass hip-hop in streaming?",
    "Will gaming exceed film industry revenue?",
    "Will Disney buy another major studio in 2026?",
    "Will 3D cinema comeback to 20% of releases?",
    "Will a TikTok creator become billionaire by 2026?",
    "Will music NFTs exceed $5B in value?",
    "Will metaverse concerts exceed 100M attendees?",
    "Will gaming collab movies total $5B+ revenue?",
  ]
  
  const allTitles = [
    ...cryptoTitles.map(t => ({ title: t, cat: "Crypto" })),
    ...politicsTitles.map(t => ({ title: t, cat: "Politics" })),
    ...sportsTitles.map(t => ({ title: t, cat: "Sports" })),
    ...economicsTitles.map(t => ({ title: t, cat: "Economics" })),
    ...techTitles.map(t => ({ title: t, cat: "Science & Tech" })),
    ...entertainmentTitles.map(t => ({ title: t, cat: "Entertainment" })),
  ]
  
  allTitles.forEach((item, index) => {
    const random = (seed: number) => Math.sin(index + seed) * 10000 - Math.floor(Math.sin(index + seed) * 10000)
    const yesPrice = Math.round(20 + random(1) * 60)
    const change = Math.round((random(3) - 0.5) * 20 * 100) / 100
    const status = statuses[Math.floor(random(4) * statuses.length)]
    const isTrending = index < 8
    
    markets.push({
      id: `market-${index + 1}`,
      title: item.title,
      category: item.cat,
      series: `${item.cat} Markets 2026`,
      eventName: item.title.substring(0, 30),
      description: `This market predicts ${item.title.toLowerCase()} Learn more and place your predictions.`,
      yesPrice,
      noPrice: 100 - yesPrice,
      change,
      volume: `$${Math.round(random(5) * 2000)}K`,
      totalVolume: `$${Math.round(random(6) * 15000)}K`,
      traders: Math.floor(random(7) * 10000 + 500),
      endDate: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Math.floor(random(8) * 12)]} ${Math.floor(random(9) * 11) + 15}, 2026`,
      resolution: "Official sources and verified data",
      created: `${Math.floor(random(10) * 30) + 1} days ago`,
      status,
      trending: isTrending,
    })
  })
  
  return markets
}

export const markets: Market[] = generateMarkets()

export function getMarketById(id: string): Market | undefined {
  return markets.find((market) => market.id === id)
}

export function getMarketsByCategory(category: string): Market[] {
  if (category === "All") return markets
  return markets.filter((market) => market.category === category)
}

export function getTrendingMarkets(limit = 8): Market[] {
  return markets.filter((market) => market.trending).slice(0, limit)
}

export function getFeaturedMarkets(limit = 12): Market[] {
  return markets.slice(0, limit)
}
