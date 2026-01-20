"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Search, TrendingUp, Banknote, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your Solana wallet to get started. Phantom, Solflare, and others supported.",
  },
  {
    icon: Search,
    title: "Discover Markets",
    description: "Browse series and events across politics, sports, crypto, and more via DFlow's Metadata API.",
  },
  {
    icon: TrendingUp,
    title: "Trade Outcomes",
    description: "Buy Yes or No outcome tokens. Prices reflect the market's implied probability.",
  },
  {
    icon: Banknote,
    title: "Redeem Resolved Outcomes",
    description: "When markets resolve, redeem settled tokens via on-chain settlement.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">How It Works</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Start trading in minutes with non-custodial, on-chain execution
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <Card key={index} className="relative border-border bg-card">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="absolute right-4 top-4 text-4xl font-bold text-muted/20">{index + 1}</span>
                  <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* DFlow badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Powered by DFlow on Solana</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/markets">
              <Button
                size="lg"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              >
                Start Trading <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://pond.dflow.net" target="_blank">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent w-full sm:w-auto">
                View DFlow Docs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
