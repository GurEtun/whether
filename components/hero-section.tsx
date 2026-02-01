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
          {/* Content - Now with animated market flow */}
          <div className="space-y-6 sm:space-y-8">
            {/* Flow Steps Indicator */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
              {FLOW_STEPS.map((step, idx) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-500 ${
                    idx === activeStep
                      ? "bg-primary text-primary-foreground scale-105"
                      : idx < activeStep
                        ? "bg-success/20 text-success"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {idx < activeStep ? (
                    <Check className="h-3 w-3" />
                  ) : idx === activeStep ? (
                    <Sparkles className="h-3 w-3 animate-pulse" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-current opacity-50" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                  {idx < FLOW_STEPS.length - 1 && (
                    <ChevronRight className="h-3 w-3 ml-1 text-muted-foreground hidden sm:block" />
                  )}
                </div>
              ))}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl text-balance">
              Trade Outcomes. <span className="text-primary">Understand Why.</span>
            </h1>

            <p className="max-w-lg text-base sm:text-lg text-muted-foreground text-pretty">
              Whether is a social prediction trading app where people trade on real-world events, discuss their reasoning, and get AI-powered market analysis — built on Solana.
            </p>

            {/* Animated Mini Market Cards */}
            <div className="relative h-24 overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur">
              <div
                className={`absolute inset-0 flex items-center px-4 transition-all duration-500 ${
                  isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {MARKETS_DATA[activeMarket].category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{MARKETS_DATA[activeMarket].volume}</span>
                  </div>
                  <p className="font-medium text-foreground text-sm sm:text-base line-clamp-1">
                    {MARKETS_DATA[activeMarket].title}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Yes</p>
                    <p className="text-lg font-bold text-success">{MARKETS_DATA[activeMarket].yes}¢</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-[3000ms] ease-linear"
                  style={{ width: isAnimating ? "0%" : "100%" }}
                />
              </div>
            </div>

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
