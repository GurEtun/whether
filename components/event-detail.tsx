"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Layers,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface NormalizedEvent {
  eventId: string
  title: string
  subtitle: string
  description: string
  category: string
  isActive: boolean
  isLive: boolean
  isTrending: boolean
  volumeUsd: string
  tvlDollars: string
  beginAt: string | null
  markets: NormalizedMarket[]
}

interface NormalizedMarket {
  marketId: string
  title: string
  subtitle: string
  description: string
  status: "open" | "closed"
  result: string | null
  isTradable: boolean
  closeTime: number
  buyYesPriceUsd: number | null
  buyNoPriceUsd: number | null
  volume: number
  volume24h: number
  openInterest: number
  liquidityDollars: number
}

/** Normalize raw Jupiter event response */
function normalizeEventResponse(raw: any): NormalizedEvent {
  return {
    eventId: raw.eventId || "",
    title: raw.metadata?.title || raw.series || "",
    subtitle: raw.metadata?.subtitle || "",
    description: raw.metadata?.subtitle || raw.closeCondition || "",
    category: raw.category || "all",
    isActive: raw.isActive ?? true,
    isLive: raw.isLive ?? false,
    isTrending: raw.isTrending ?? false,
    volumeUsd: raw.volumeUsd || "0",
    tvlDollars: raw.tvlDollars || "0",
    beginAt: raw.beginAt || null,
    markets: (raw.markets || []).map((m: any) => ({
      marketId: m.marketId || "",
      title: m.metadata?.title || "",
      subtitle: m.metadata?.subtitle || "",
      description: m.metadata?.description || m.metadata?.subtitle || "",
      status: m.status === "open" ? "open" as const : "closed" as const,
      result: m.result || null,
      isTradable: m.metadata?.isTradable ?? true,
      closeTime: m.closeTime || m.metadata?.closeTime || 0,
      buyYesPriceUsd: m.pricing?.buyYesPriceUsd ?? null,
      buyNoPriceUsd: m.pricing?.buyNoPriceUsd ?? null,
      volume: m.pricing?.volume ?? 0,
      volume24h: m.pricing?.volume24h ?? 0,
      openInterest: m.pricing?.openInterest ?? 0,
      liquidityDollars: m.pricing?.liquidityDollars ?? 0,
    })),
  }
}

export function EventDetail({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<NormalizedEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEventData() {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch event details (includes markets with includeMarkets=true)
        const eventResponse = await fetch(`/api/jup/events/${eventId}`)
        if (!eventResponse.ok) throw new Error("Failed to fetch event")
        const rawData = await eventResponse.json()
        
        console.log("[v0] Raw event response:", rawData)
        const normalized = normalizeEventResponse(rawData)
        console.log("[v0] Normalized event:", normalized.title, "markets:", normalized.markets.length)
        setEvent(normalized)
      } catch (err) {
        console.error("[v0] Error fetching event data:", err)
        setError(err instanceof Error ? err.message : "Failed to load event")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventData()
  }, [eventId])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-3" />
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              {error || "Event not found"}
            </p>
            <Button asChild>
              <Link href="/">Back to Markets</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Markets
        </Link>
      </Button>

      {/* Event Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs capitalize">
            {event.category}
          </Badge>
          {event.isLive && (
            <Badge variant="default" className="text-xs">Live</Badge>
          )}
          {event.isActive && !event.isLive && (
            <Badge variant="default" className="text-xs">Active</Badge>
          )}
          {!event.isActive && (
            <Badge variant="secondary" className="text-xs">Closed</Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
          {event.title}
        </h1>

        {event.subtitle && (
          <p className="text-muted-foreground mb-4">
            {event.subtitle}
          </p>
        )}

        {/* Event Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            {event.markets.length} Markets
          </span>
          {parseFloat(event.volumeUsd) > 0 && (
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              ${(parseFloat(event.volumeUsd) / 1000).toFixed(0)}K Volume
            </span>
          )}
          {parseFloat(event.tvlDollars) > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              ${(parseFloat(event.tvlDollars) / 1000).toFixed(0)}K TVL
            </span>
          )}
        </div>
      </div>

      {/* Markets Grid */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">
          Prediction Markets ({event.markets.length})
        </h2>
      </div>

      {event.markets.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-card">
          <p className="text-muted-foreground">No markets available for this event</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {event.markets.map((market) => (
            <EventMarketCard key={market.marketId} market={market} />
          ))}
        </div>
      )}
    </div>
  )
}

function EventMarketCard({ market }: { market: NormalizedMarket }) {
  // Convert USD price (0-1 range) to percentage for display
  const yesPct = market.buyYesPriceUsd != null ? Math.round(market.buyYesPriceUsd * 100) : 50
  const noPct = market.buyNoPriceUsd != null ? Math.round(market.buyNoPriceUsd * 100) : 50
  const vol = market.volume || 0

  return (
    <Card
      className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full"
      onClick={() => (window.location.href = `/markets/${market.marketId}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge 
            variant={market.status === "open" ? "default" : "secondary"}
            className="text-xs capitalize"
          >
            {market.status}
          </Badge>
          {market.result && (
            <Badge variant={market.result === "yes" ? "default" : "secondary"} className="text-xs">
              Result: {market.result}
            </Badge>
          )}
        </div>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary">
          {market.title}
        </h3>
        {market.subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-1">{market.subtitle}</p>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Yes</p>
            <p className="text-3xl font-bold text-success">{yesPct}&#162;</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">No</p>
            <p className="text-xl font-semibold text-danger">{noPct}&#162;</p>
          </div>
        </div>

        {/* Mini probability bar */}
        <div className="flex gap-1">
          <div 
            className="h-2 rounded-l-full bg-success transition-all" 
            style={{ width: `${yesPct}%` }} 
          />
          <div 
            className="h-2 rounded-r-full bg-danger transition-all" 
            style={{ width: `${noPct}%` }} 
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>Yes {yesPct}%</span>
          <span>No {noPct}%</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {vol > 0 && (
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> 
              ${(vol / 1000).toFixed(0)}K vol
            </span>
          )}
          {market.openInterest > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> ${(market.openInterest / 1000).toFixed(0)}K OI
            </span>
          )}
        </div>
        {market.closeTime > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {new Date(market.closeTime * 1000).toLocaleDateString()}
          </span>
        )}
      </CardFooter>
    </Card>
  )
}
