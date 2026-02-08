"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Layers,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  category: string
  status: string
  startTime?: string
  endTime?: string
  marketCount: number
  volume: number
  traders?: number
}

interface Market {
  id: string
  eventId: string
  title: string
  yesPrice: number
  noPrice: number
  volume: number
  traders: number
  status: string
  endDate: string
}

export function EventDetail({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [markets, setMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEventData() {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch event details
        const eventResponse = await fetch(`/api/jup/events/${eventId}`)
        if (!eventResponse.ok) throw new Error("Failed to fetch event")
        const eventData = await eventResponse.json()
        
        console.log("[v0] Fetched event:", eventData)
        setEvent(eventData)

        // Fetch markets for this event
        const marketsResponse = await fetch(`/api/jup/events/${eventId}/markets?limit=20`)
        if (!marketsResponse.ok) throw new Error("Failed to fetch markets")
        const marketsData = await marketsResponse.json()
        
        console.log("[v0] Fetched markets for event:", marketsData)
        setMarkets(marketsData.markets || [])
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
          <Badge variant="secondary" className="text-xs">
            {event.category}
          </Badge>
          <Badge 
            variant={event.status === "active" ? "default" : "secondary"}
            className="text-xs capitalize"
          >
            {event.status}
          </Badge>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          {event.title}
        </h1>

        <p className="text-muted-foreground mb-4">
          {event.description}
        </p>

        {/* Event Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            {markets.length} Markets
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            ${(event.volume / 1000).toFixed(0)}K Volume
          </span>
          {event.traders && (
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {event.traders.toLocaleString()} Traders
            </span>
          )}
          {event.endTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Ends {new Date(event.endTime).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Markets Grid */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">
          Prediction Markets ({markets.length})
        </h2>
      </div>

      {markets.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-card">
          <p className="text-muted-foreground">No markets available for this event</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  )
}

function MarketCard({ market }: { market: Market }) {
  const change = Math.round((Math.random() - 0.5) * 20 * 100) / 100
  const isPositive = change >= 0

  return (
    <Card
      className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full"
      onClick={() => (window.location.href = `/markets/${market.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge 
            variant={market.status === "active" ? "default" : "secondary"}
            className="text-xs capitalize"
          >
            {market.status}
          </Badge>
        </div>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary">
          {market.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Yes Price</p>
            <p className="text-3xl font-bold text-success">{market.yesPrice}¢</p>
          </div>
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium ${
              isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}
            {change}%
          </div>
        </div>

        {/* Mini probability bar */}
        <div className="flex gap-1">
          <div 
            className="h-2 rounded-l-full bg-success transition-all" 
            style={{ width: `${market.yesPrice}%` }} 
          />
          <div 
            className="h-2 rounded-r-full bg-danger transition-all" 
            style={{ width: `${100 - market.yesPrice}%` }} 
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>Yes {market.yesPrice}%</span>
          <span>No {100 - market.yesPrice}%</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> 
            ${(market.volume / 1000).toFixed(0)}K
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {market.traders.toLocaleString()}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {market.endDate}
        </span>
      </CardFooter>
    </Card>
  )
}
