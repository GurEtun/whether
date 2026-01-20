"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Shield, Zap, Activity, Layers } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Badge variant="secondary" className="gap-1.5 border-primary/20 bg-primary/10 text-primary sm:gap-2">
                <Zap className="h-3 w-3" /> Powered by DFlow
              </Badge>
              <Badge variant="outline" className="gap-1 border-border text-muted-foreground sm:gap-1.5">
                <Activity className="h-3 w-3" /> Solana
              </Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl text-balance">
              Trade Outcomes. <span className="text-primary">Understand Why.</span>
            </h1>

            <p className="max-w-lg text-base sm:text-lg text-muted-foreground text-pretty">
              Whether is a social prediction trading app where people trade on real-world events, discuss their reasoning, and get AI-powered market analysis — powered by DFlow on Solana.
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

            <div className="grid grid-cols-3 gap-4 pt-6 sm:gap-8 sm:pt-8">
              <div>
                <p className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">$2.4B+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Trading Volume</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">150K+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Traders</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">500+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Live Markets</p>
              </div>
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
