"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Shield, Zap, Layers, ChevronRight, Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Animated market data for the showcase
const MARKETS_DATA = [
  { id: 1, title: "BTC reaches $150K by March 2026?", yes: 67, category: "Crypto", volume: "$1.2M" },
  { id: 2, title: "Fed cuts rates in Q1 2026?", yes: 45, category: "Economics", volume: "$890K" },
  { id: 3, title: "SpaceX Starship orbital success?", yes: 78, category: "Science", volume: "$2.1M" },
  { id: 4, title: "ETH flips BTC market cap?", yes: 12, category: "Crypto", volume: "$3.4M" },
]

const FLOW_STEPS = [
  { label: "Select Market", icon: "search" },
  { label: "Place Trade", icon: "trade" },
  { label: "Track Position", icon: "chart" },
  { label: "Settle & Profit", icon: "check" },
]

export function HeroSection() {
  const [activeMarket, setActiveMarket] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-cycle through markets
  useEffect(() => {
    const marketInterval = setInterval(() => {
      setActiveMarket((prev) => (prev + 1) % MARKETS_DATA.length)
    }, 3000)
    return () => clearInterval(marketInterval)
  }, [])

  // Auto-cycle through flow steps
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveStep((prev) => (prev + 1) % FLOW_STEPS.length)
        setIsAnimating(false)
      }, 300)
    }, 2000)
    return () => clearInterval(stepInterval)
  }, [])

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Content - Animated Trading Flow Demo */}
          <div className="space-y-6 sm:space-y-8">
            {/* Interactive Trading Flow Animation */}
            <div className="relative rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-4 sm:p-6 overflow-hidden">
              {/* Animated background glow */}
              <div 
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  activeStep === 3 ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-success/5" />
              </div>

              {/* Flow Steps Timeline - Abstract Gray Dots */}
              <div className="relative mb-6 flex items-center justify-center gap-2">
                {FLOW_STEPS.map((step, idx) => (
                  <div key={step.label} className="flex flex-col items-center gap-2">
                    {/* Abstract dot indicator */}
                    <div
                      className={`transition-all duration-500 ${
                        idx <= activeStep
                          ? "h-2 w-2 bg-muted-foreground/80"
                          : "h-1.5 w-1.5 bg-muted-foreground/30"
                      } rounded-full`}
                    />
                    {/* Subtle connector line */}
                    {idx < FLOW_STEPS.length - 1 && (
                      <div className="absolute left-1/2 top-1 w-8 h-px bg-gradient-to-r from-muted-foreground/30 to-transparent" />
                    )}
                  </div>
                ))}
              </div>

              {/* Dynamic Content Based on Step */}
              <div className="relative min-h-[140px] sm:min-h-[160px]">
                {/* Step 0: Browse Markets */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeStep === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">Browsing markets...</p>
                      <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                        {MARKETS_DATA[activeMarket].title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{MARKETS_DATA[activeMarket].category}</Badge>
                        <span className="text-xs text-muted-foreground">{MARKETS_DATA[activeMarket].volume} vol</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 1: Place Trade */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeStep === 1 ? "opacity-100 translate-x-0" : activeStep < 1 ? "opacity-0 translate-x-8 pointer-events-none" : "opacity-0 -translate-x-8 pointer-events-none"
                  }`}
                >
                  <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">Place Your Trade</span>
                      <Badge className="bg-primary/10 text-primary text-xs">YES @ {MARKETS_DATA[activeMarket].yes}¢</Badge>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground h-10 text-sm font-semibold">
                        Yes {MARKETS_DATA[activeMarket].yes}¢
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-danger/30 text-danger hover:bg-danger/10 h-10 text-sm font-semibold">
                        No {100 - MARKETS_DATA[activeMarket].yes}¢
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Amount: $50.00</span>
                      <span>Est. payout: ${(50 / (MARKETS_DATA[activeMarket].yes / 100)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Step 2: Track Position - 3D Cards */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeStep === 2 ? "opacity-100 translate-x-0" : activeStep < 2 ? "opacity-0 translate-x-8 pointer-events-none" : "opacity-0 -translate-x-8 pointer-events-none"
                  }`}
                >
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border overflow-hidden space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs sm:text-sm font-medium text-foreground">Your Position</span>
                      <span className="text-xs sm:text-sm text-success font-medium">+$12.50 (25%)</span>
                    </div>
                    
                    {/* 3D Position Cards */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {/* Card 1: Shares */}
                      <div className="relative group perspective">
                        <div className="relative p-2.5 sm:p-3 rounded-lg border border-border bg-gradient-to-br from-card to-secondary/50 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/20" style={{ transform: "rotateX(5deg) rotateY(-5deg)" }}>
                          <p className="text-xs text-muted-foreground mb-1">Shares</p>
                          <p className="text-sm sm:text-base font-bold text-foreground">75</p>
                          <p className="text-xs text-muted-foreground mt-1">YES</p>
                        </div>
                      </div>
                      
                      {/* Card 2: Avg Price */}
                      <div className="relative group perspective">
                        <div className="relative p-2.5 sm:p-3 rounded-lg border border-border bg-gradient-to-br from-card to-secondary/50 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/20" style={{ transform: "rotateX(5deg) rotateY(0deg)" }}>
                          <p className="text-xs text-muted-foreground mb-1">Avg. Price</p>
                          <p className="text-sm sm:text-base font-bold text-primary">{MARKETS_DATA[activeMarket].yes}¢</p>
                          <p className="text-xs text-muted-foreground mt-1">entry</p>
                        </div>
                      </div>
                      
                      {/* Card 3: Value */}
                      <div className="relative group perspective">
                        <div className="relative p-2.5 sm:p-3 rounded-lg border border-border bg-gradient-to-br from-card to-secondary/50 transition-all duration-300 group-hover:border-success/50 group-hover:shadow-lg group-hover:shadow-success/20" style={{ transform: "rotateX(5deg) rotateY(5deg)" }}>
                          <p className="text-xs text-muted-foreground mb-1">Value</p>
                          <p className="text-sm sm:text-base font-bold text-success">$62.50</p>
                          <p className="text-xs text-success mt-1">+25%</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mini chart line */}
                    <div className="mt-4 p-2 sm:p-3 rounded-lg border border-border/50 bg-card/30 backdrop-blur">
                      <p className="text-xs text-muted-foreground mb-2">Price Movement</p>
                      <div className="h-6 sm:h-8 flex items-end gap-0.5">
                        {[40, 55, 48, 62, 58, 70, 65, 78, 72, 85].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all duration-300"
                            style={{ height: `${h}%`, transitionDelay: `${i * 50}ms`, boxShadow: `0 0 6px rgba(var(--primary), 0.3)` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Purchased/Settled */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeStep === 3 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-success/20 to-success/5 border border-success/30 text-center">
                    <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-success mb-2 sm:mb-3">
                      <Check className="h-6 w-6 sm:h-8 sm:w-8 text-success-foreground" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-foreground mb-1">Trade Done!</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Position active</p>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-success/20 text-success text-xs sm:text-sm font-medium">
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">+$37.50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl text-balance">
              Trade Outcomes. <span className="text-primary">Understand Why.</span>
            </h1>

            <p className="max-w-lg text-base sm:text-lg text-muted-foreground text-pretty">
              Whether is a social prediction trading app where people trade on real-world events, discuss their reasoning, and get AI-powered market analysis — built on Solana.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href="/markets" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  Explore Markets <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-2 bg-transparent">
                  <Layers className="h-4 w-4" /> Learn How It Works
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-2xl sm:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-success/10 text-success text-xs sm:text-sm">
                    <span className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-success" />
                    Active
                  </Badge>
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Binary
                  </Badge>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">Closes in 14d 6h</span>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-foreground sm:text-xl">
                Will BTC reach $150K by March 2026?
              </h3>

              <p className="mb-4 sm:mb-6 text-sm text-muted-foreground">
                Resolves Yes if Bitcoin price exceeds $150,000 on CoinGecko before March 31, 2026.
              </p>

              <div className="mb-4 sm:mb-6 space-y-3">
                <MarketOption label="Yes" probability={67} color="success" />
                <MarketOption label="No" probability={33} color="danger" />
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" /> $1.2M Volume
                  </span>
                </div>
                <Link href="/markets/btc-150k-march-2026" className="w-full sm:w-auto">
                  <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Trade Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="absolute -right-4 top-4 hidden rounded-xl border border-border bg-card p-3 shadow-lg xl:block">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">On-Chain Settlement</span>
              </div>
            </div>

            <div className="absolute -left-4 bottom-8 hidden rounded-xl border border-border bg-card p-3 shadow-lg xl:block">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-warning" />
                <span className="text-sm font-medium text-foreground">Sync & Async Execution</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MarketOption({
  label,
  probability,
  color,
}: { label: string; probability: number; color: "success" | "danger" }) {
  const bgColor = color === "success" ? "bg-success" : "bg-danger"
  const textColor = color === "success" ? "text-success" : "text-danger"

  return (
    <div className="group cursor-pointer rounded-lg border border-border bg-secondary/50 p-3 transition-all hover:border-primary/50 hover:bg-secondary">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium text-foreground">{label}</span>
        <span className={`text-lg font-bold ${textColor}`}>{probability}¢</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${bgColor} transition-all`} style={{ width: `${probability}%` }} />
      </div>
    </div>
  )
}
