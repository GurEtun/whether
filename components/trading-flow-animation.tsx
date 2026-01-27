"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Shield, Zap, CheckCircle2, ArrowRight } from "lucide-react"

type Scene = "discover" | "trade" | "track" | "redeem"

export function TradingFlowAnimation() {
  const [currentScene, setCurrentScene] = useState<Scene>("discover")
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    if (!animate) return

    const interval = setInterval(() => {
      setCurrentScene((prev) => {
        switch (prev) {
          case "discover":
            return "trade"
          case "trade":
            return "track"
          case "track":
            return "redeem"
          case "redeem":
            return "discover"
          default:
            return "discover"
        }
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [animate])

  const scenes = {
    discover: {
      title: "Discover Markets",
      description: "Browse hundreds of live prediction markets",
      content: (
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-secondary/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Will BTC reach $150K?</span>
              <Badge variant="secondary" className="bg-success/10 text-success text-xs">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Resolves March 31, 2026</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Will ETH flip BTC?</span>
              <Badge variant="secondary" className="bg-warning/10 text-warning text-xs">Closing Soon</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Resolves June 30, 2026</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Will Fed cut rates?</span>
              <Badge variant="secondary" className="bg-info/10 text-info text-xs">New</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Resolves Q2 2026</p>
          </div>
        </div>
      ),
    },
    trade: {
      title: "Place Your Trade",
      description: "Choose outcome and set your position",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Will BTC reach $150K?</h4>
            <p className="text-xs text-muted-foreground">Binary prediction market</p>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg border-2 border-success bg-success/5 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-success">YES</span>
                <span className="text-lg font-bold text-success">67¢</span>
              </div>
              <div className="h-2 bg-success/20 rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: "67%" }} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">NO</span>
                <span className="text-lg font-bold text-muted-foreground">33¢</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-danger" style={{ width: "33%" }} />
              </div>
            </div>
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
            <p className="text-xs text-foreground">Buying 100 shares @ 67¢ = $67</p>
          </div>
        </div>
      ),
    },
    track: {
      title: "Track Your Position",
      description: "Monitor your portfolio in real-time",
      content: (
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-secondary/50 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">BTC @ $150K</span>
              <span className="text-xs text-success font-semibold">+$28.50</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">100 shares @ 95¢</p>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-success" style={{ width: "95%" }} />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Total Portfolio</span>
              <span className="text-lg font-bold text-success">$95.50</span>
            </div>
            <p className="text-xs text-muted-foreground">Started with $67.00</p>
          </div>
        </div>
      ),
    },
    redeem: {
      title: "Redeem Winnings",
      description: "Claim your settled tokens on-chain",
      content: (
        <div className="space-y-3">
          <div className="rounded-lg bg-success/10 border border-success/30 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-success">Market Resolved: YES</p>
                <p className="text-xs text-success/80 mt-1">BTC reached $150K on Dec 15, 2025</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Settlement Tokens</span>
              <span className="text-sm font-bold text-foreground">100 YES tokens</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Redemption Value</span>
              <span className="text-sm font-bold text-success">$100.00</span>
            </div>
            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Your Profit</span>
              <span className="text-lg font-bold text-success">+$33.00</span>
            </div>
          </div>
        </div>
      ),
    },
  }

  const sceneData = scenes[currentScene]

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-2xl sm:p-6 overflow-hidden">
      {/* Scene Indicators */}
      <div className="flex items-center gap-2 mb-4">
        {(["discover", "trade", "track", "redeem"] as const).map((scene, idx) => (
          <div key={scene} className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScene(scene)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentScene === scene
                  ? "bg-primary w-8"
                  : "bg-border w-2 hover:bg-primary/50"
              }`}
              aria-label={`Scene ${idx + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Scene Title */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-foreground sm:text-xl flex items-center gap-2">
          {currentScene === "discover" && <TrendingUp className="h-5 w-5 text-primary" />}
          {currentScene === "trade" && <Zap className="h-5 w-5 text-warning" />}
          {currentScene === "track" && <Shield className="h-5 w-5 text-info" />}
          {currentScene === "redeem" && <CheckCircle2 className="h-5 w-5 text-success" />}
          {sceneData.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{sceneData.description}</p>
      </div>

      {/* Scene Content with Animation */}
      <div className="min-h-[240px] sm:min-h-[280px] relative">
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {sceneData.content}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="mt-4 sm:mt-6 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="animate-pulse h-2 w-2 rounded-full bg-primary" />
          Auto-playing
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {currentScene === "discover" && "1 of 4"}
          {currentScene === "trade" && "2 of 4"}
          {currentScene === "track" && "3 of 4"}
          {currentScene === "redeem" && "4 of 4"}
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  )
}
