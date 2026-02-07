"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Shield, CheckCircle2, Zap } from "lucide-react"

type Scene = "discover" | "trade" | "track" | "redeem"

export function TradingFlowAnimation() {
  const [currentScene, setCurrentScene] = useState<Scene>("discover")

  useEffect(() => {
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
  }, [])

  const sceneConfigs: Record<Scene, { title: string; description: string; icon: React.ReactNode }> = {
    discover: {
      title: "Discover Markets",
      description: "Browse hundreds of live prediction markets",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    trade: {
      title: "Place Your Trade",
      description: "Choose outcome and set your position",
      icon: <Zap className="h-5 w-5" />,
    },
    track: {
      title: "Track Positions",
      description: "Monitor your portfolio in real-time",
      icon: <Shield className="h-5 w-5" />,
    },
    redeem: {
      title: "Redeem Winnings",
      description: "Settle and withdraw your profits on-chain",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
  }

  return (
    <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-2xl">
      {/* Scene indicators */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(["discover", "trade", "track", "redeem"] as Scene[]).map((scene) => (
            <button
              key={scene}
              onClick={() => setCurrentScene(scene)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentScene === scene
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Scene ${scene}`}
            />
          ))}
        </div>
      </div>

      {/* Scene header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {sceneConfigs[currentScene].icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{sceneConfigs[currentScene].title}</h3>
          <p className="text-sm text-muted-foreground">{sceneConfigs[currentScene].description}</p>
        </div>
      </div>

      {/* Scene content with smooth fade transition */}
      <div className="relative min-h-48 overflow-hidden">
        <div
          className="transition-all duration-500 opacity-100"
          key={currentScene}
        >
          {currentScene === "discover" && <SceneDiscover />}
          {currentScene === "trade" && <SceneTrade />}
          {currentScene === "track" && <SceneTrack />}
          {currentScene === "redeem" && <SceneRedeem />}
        </div>
      </div>

      {/* Auto-play indicator */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        Auto-playing scenes
      </div>
    </div>
  )
}

function SceneDiscover() {
  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <div className="rounded-lg border border-border bg-secondary/50 p-3 space-y-2 hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Will BTC reach $150K?</span>
          <Badge variant="secondary" className="bg-success/10 text-success text-xs">Active</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Resolves March 31, 2026 • $1.2M volume</p>
      </div>
      <div className="rounded-lg border border-border bg-secondary/50 p-3 space-y-2 hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Will ETH flip BTC?</span>
          <Badge variant="secondary" className="bg-warning/10 text-warning text-xs">Closing Soon</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Resolves June 30, 2026 • $800K volume</p>
      </div>
      <div className="rounded-lg border border-border bg-secondary/50 p-3 space-y-2 hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Will Fed cut rates?</span>
          <Badge variant="secondary" className="bg-info/10 text-info text-xs">New</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Resolves Q2 2026 • $450K volume</p>
      </div>
    </div>
  )
}

function SceneTrade() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Will BTC reach $150K?</h4>
        
        <div className="space-y-2 mb-4">
          <div className="rounded-lg border-2 border-success bg-success/5 p-3 cursor-pointer hover:bg-success/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-success">YES</span>
              <span className="text-xl font-bold text-success">67¢</span>
            </div>
            <div className="h-2 bg-success/20 rounded-full overflow-hidden">
              <div className="h-full bg-success animate-pulse" style={{ width: "67%" }} />
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-secondary/50 p-3 cursor-pointer hover:border-danger/50 transition-colors">
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
          <p className="text-xs text-foreground font-medium">Buying 100 shares @ 67¢</p>
          <p className="text-sm font-bold text-primary mt-1">Total: $67.00</p>
        </div>
      </div>
    </div>
  )
}

function SceneTrack() {
  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <div className="rounded-lg border border-border bg-secondary/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">Will BTC reach $150K?</span>
          <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded">Active</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Position: 100 shares (YES)</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Entry Price</span>
            <span className="text-foreground font-medium">67¢</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Current Price</span>
            <span className="text-success font-medium">71¢</span>
          </div>
          <div className="flex justify-between text-xs font-semibold pt-2 border-t border-border">
            <span className="text-foreground">Unrealized P&L</span>
            <span className="text-success">+$4.00 (+6%)</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-secondary/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">Will ETH flip BTC?</span>
          <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded">Closing Soon</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Position: 50 shares (NO)</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Entry Price</span>
            <span className="text-foreground font-medium">42¢</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Current Price</span>
            <span className="text-danger font-medium">38¢</span>
          </div>
          <div className="flex justify-between text-xs font-semibold pt-2 border-t border-border">
            <span className="text-foreground">Unrealized P&L</span>
            <span className="text-danger">-$2.00 (-5%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SceneRedeem() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="rounded-lg border border-success/30 bg-success/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20 text-success">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-success mb-1">Market Resolved</h4>
            <p className="text-xs text-success/80">Will BTC reach $150K? → YES</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-secondary/50 p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Your Position</p>
          <p className="text-sm font-semibold text-foreground">100 YES shares</p>
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Redemption Value</p>
          <p className="text-lg font-bold text-success">$100.00</p>
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Total Profit</p>
          <p className="text-lg font-bold text-success">+$33.00</p>
          <p className="text-xs text-success/80">+49% ROI</p>
        </div>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">Funds settle on-chain automatically</p>
      </div>
    </div>
  )
}
