"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Route, Shield, Clock, ArrowLeftRight, Coins, GitBranch, CheckCircle2 } from "lucide-react"

const features = [
  {
    icon: Route,
    title: "Smart Order Routing",
    description: "Automatically route orders for best execution across liquidity sources.",
    badge: "Trading",
  },
  {
    icon: ArrowLeftRight,
    title: "Sync & Async Execution",
    description: "Atomic trades for simple orders, multi-transaction flows for complex positions.",
    badge: "Execution",
  },
  {
    icon: Coins,
    title: "Any Token to Position",
    description: "Trade from any spot token - automatic conversion to settlement mint.",
    badge: "Tokenization",
  },
  {
    icon: GitBranch,
    title: "Series & Events",
    description: "Hierarchical market organization for related prediction opportunities.",
    badge: "Discovery",
  },
  {
    icon: Shield,
    title: "On-Chain Settlement",
    description: "All positions settle trustlessly on Solana with verifiable outcomes.",
    badge: "Security",
  },
  {
    icon: CheckCircle2,
    title: "Automated Redemption",
    description: "When markets resolve, settled tokens are redeemable via on-chain settlement.",
    badge: "Settlement",
  },
]

export function TradingFeatures() {
  return (
    <section className="border-y border-border bg-card/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            
          </div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl mb-2 sm:mb-3">
            Non-Custodial, On-Chain Execution
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground px-4">
            Transparent, secure, and fully on-chain prediction market trading with best execution on Solana.
          </p>
        </div>

        

        <div className="mt-8 rounded-2xl border border-border bg-card p-4 sm:mt-12 sm:p-6">
          <h3 className="text-center text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
            Complete Trading Lifecycle
          </h3>
          <div className="flex flex-col items-start gap-6 sm:items-center md:flex-row md:justify-center md:gap-0">
            <LifecycleStep
              step={1}
              title="Discover Markets"
              description="Filter by categories, tags, status"
              icon={<Route className="h-4 w-4 sm:h-5 sm:w-5" />}
            />
            <StepConnector />
            <LifecycleStep
              step={2}
              title="Trade Tokens"
              description="Buy/sell outcome tokens"
              icon={<ArrowLeftRight className="h-4 w-4 sm:h-5 sm:w-5" />}
            />
            <StepConnector />
            <LifecycleStep
              step={3}
              title="Track Positions"
              description="On-chain portfolio view"
              icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
            />
            <StepConnector />
            <LifecycleStep
              step={4}
              title="Redeem Resolved Outcomes"
              description="Redeem settled tokens"
              icon={<CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function LifecycleStep({
  step,
  title,
  description,
  icon,
}: {
  step: number
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4 text-left md:flex-col md:text-center md:px-4 w-full md:w-auto">
      <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary relative">
        {icon}
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {step}
        </span>
      </div>
      <div className="flex-1 md:flex-none">
        <h4 className="font-semibold text-foreground text-sm sm:text-base">{title}</h4>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
}

function StepConnector() {
  return (
    <>
      <div className="hidden md:block h-px w-8 lg:w-12 bg-border" />
      <div className="block md:hidden h-8 w-px bg-border ml-6" />
    </>
  )
}
