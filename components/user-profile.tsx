"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Wallet, TrendingUp, Target, Award, Copy, Check, Edit2 } from "lucide-react"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"

export function UserProfile() {
  const { primaryWallet, user } = useDynamicContext()
  const [copied, setCopied] = useState(false)
  const [username, setUsername] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Try to load username from localStorage or generate from wallet
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    } else if (primaryWallet?.address) {
      const shortAddress = `${primaryWallet.address.slice(0, 6)}`
      setUsername(`trader_${shortAddress}`)
    }
  }, [primaryWallet])

  const handleCopyAddress = async () => {
    if (primaryWallet?.address) {
      await navigator.clipboard.writeText(primaryWallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSaveUsername = () => {
    if (username.trim()) {
      localStorage.setItem("username", username)
      setIsEditing(false)
    }
  }

  // Mock stats - in production, fetch from API
  const stats = {
    totalTrades: 47,
    winRate: 68,
    totalVolume: 12450,
    rank: 142,
    level: 12,
    xp: 3420,
    xpToNext: 5000,
  }

  const badges = [
    { id: 1, name: "Early Trader", icon: Target, rarity: "rare" },
    { id: 2, name: "Market Maven", icon: TrendingUp, rarity: "epic" },
    { id: 3, name: "Prediction Pro", icon: Award, rarity: "legendary" },
  ]

  return (
    <Card className="overflow-hidden border-border bg-card">
      {/* Header with gradient */}
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20" />
      
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <Avatar className="h-24 w-24 border-4 border-card bg-secondary">
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Level badge */}
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground border-2 border-card">
            {stats.level}
          </div>
        </div>

        <div className="pt-10">
          {/* Username and wallet */}
          <div className="mb-4">
            {isEditing ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-3 py-1 rounded-lg border border-border bg-background text-foreground text-xl font-bold"
                  placeholder="Enter username"
                />
                <Button size="sm" onClick={handleSaveUsername}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{username}</h1>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {primaryWallet?.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" />
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs">
                  {`${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyAddress}
                  className="h-6 w-6 p-0"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            )}
          </div>

          {/* XP Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Level {stats.level}</span>
              <span className="font-medium text-foreground">
                {stats.xp} / {stats.xpToNext} XP
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                style={{ width: `${(stats.xp / stats.xpToNext) * 100}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalTrades}</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-success">{stats.winRate}%</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground mb-1">Volume</p>
              <p className="text-2xl font-bold text-foreground">${(stats.totalVolume / 1000).toFixed(1)}K</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground mb-1">Rank</p>
              <p className="text-2xl font-bold text-primary">#{stats.rank}</p>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Achievements</h3>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="group relative flex items-center gap-2 rounded-lg border border-border bg-gradient-to-br from-card to-secondary/50 px-3 py-2 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      badge.rarity === "legendary"
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : badge.rarity === "epic"
                          ? "bg-gradient-to-br from-purple-500 to-pink-500"
                          : "bg-gradient-to-br from-blue-500 to-cyan-500"
                    }`}
                  >
                    <badge.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{badge.name}</span>
                  <Badge
                    variant="secondary"
                    className={`ml-1 text-xs ${
                      badge.rarity === "legendary"
                        ? "bg-amber-500/20 text-amber-500"
                        : badge.rarity === "epic"
                          ? "bg-purple-500/20 text-purple-500"
                          : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    {badge.rarity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
