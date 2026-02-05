"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, MessageSquare, Heart, Share2, Tag, Filter, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { CreatePostDialog } from "@/components/create-post-dialog"

// Mock network posts data
const mockNetworkPosts = [
  {
    id: 1,
    user: { username: "CryptoKing", address: "5h2k...9x4p", level: 12, avatar: "CK" },
    content: "Just placed a big YES position on BTC hitting $150K by March. The technical indicators are looking bullish and institutional adoption is accelerating.",
    taggedMarkets: [
      { id: "btc-150k", title: "BTC reaches $150K by March 2026?", yesPrice: 67, category: "Crypto" }
    ],
    media: [
      { type: "image" as const, url: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    likes: 124,
    comments: 38,
    position: { type: "YES", amount: 5000, price: 67 }
  },
  {
    id: 2,
    user: { username: "MacroTrader", address: "8k3m...2n5x", level: 15, avatar: "MT" },
    content: "Interesting to see the Fed rate cut market moving. I'm staying on the NO side for Q1 2026 - inflation data still too high IMO. Anyone else thinking the same?",
    taggedMarkets: [
      { id: "fed-cuts", title: "Fed cuts rates in Q1 2026?", yesPrice: 45, category: "Economics" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 89,
    comments: 42,
    position: { type: "NO", amount: 2500, price: 55 }
  },
  {
    id: 3,
    user: { username: "SpaceEnthusiast", address: "9x7f...4k2m", level: 8, avatar: "SE" },
    content: "SpaceX has been nailing their tests lately. High confidence on orbital success within the next few months. The engineering progress is incredible!",
    taggedMarkets: [
      { id: "starship", title: "SpaceX Starship orbital success?", yesPrice: 78, category: "Science" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    likes: 156,
    comments: 67,
    position: { type: "YES", amount: 1500, price: 78 }
  },
  {
    id: 4,
    user: { username: "EthMaxi", address: "2n4x...7h9k", level: 10, avatar: "EM" },
    content: "ETH is building incredible momentum. Layer 2s are scaling, institutions are adopting, and the merge is showing its benefits. Still early but the flippening is coming.",
    taggedMarkets: [
      { id: "eth-flip", title: "ETH flips BTC market cap?", yesPrice: 12, category: "Crypto" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    likes: 203,
    comments: 95,
    position: { type: "YES", amount: 3500, price: 12 }
  },
  {
    id: 5,
    user: { username: "AIResearcher", address: "6h8k...3m2n", level: 14, avatar: "AR" },
    content: "Just saw the latest AI benchmarks. The progress in reasoning capabilities is mind-blowing. We're getting closer to AGI faster than most people think.",
    taggedMarkets: [
      { id: "agi-2026", title: "AGI achieved by end of 2026?", yesPrice: 23, category: "Technology" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    likes: 178,
    comments: 84,
    position: { type: "YES", amount: 2000, price: 23 }
  }
]

export function SocialFeed() {
  const [filter, setFilter] = useState<"all" | "following">("all")
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Post */}
      <div className="flex items-center justify-between gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="flex-1">
          <TabsList className="grid w-full max-w-[300px] grid-cols-2">
            <TabsTrigger value="all" className="gap-2">
              <Users className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="following" className="gap-2">
              <Heart className="h-4 w-4" />
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <CreatePostDialog />
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {mockNetworkPosts.map((post) => (
          <Card key={post.id} className="p-4 sm:p-6 border-border bg-card hover:border-primary/30 transition-colors">
            {/* Post Header */}
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-semibold">
                  {post.user.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                    {post.user.username}
                  </span>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    Lv {post.user.level}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {post.user.address}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    · {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-foreground leading-relaxed">{post.content}</p>
              </div>
            </div>

            {/* Media Gallery */}
            {post.media && post.media.length > 0 && (
              <div className={`mb-4 grid gap-2 rounded-lg overflow-hidden ${
                post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}>
                {post.media.map((media, idx) => (
                  <div key={idx} className="relative bg-secondary/20 rounded-lg overflow-hidden">
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt="Post media"
                        className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    ) : (
                      <video
                        src={media.url}
                        controls
                        className="w-full h-48 sm:h-64 object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tagged Markets */}
            {post.taggedMarkets.length > 0 && (
              <div className="mb-4 space-y-2">
                {post.taggedMarkets.map((market) => (
                  <div
                    key={market.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-gradient-to-r from-secondary/50 to-secondary/30 p-3 hover:border-primary/50 transition-colors cursor-pointer group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Tag className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {market.title}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-1">{market.category}</Badge>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge className="bg-success/20 text-success border-success/30">
                        YES {market.yesPrice}¢
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Position Info */}
            {post.position && (
              <div className="mb-4 rounded-lg border border-border bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Position</span>
                      <p className="text-xs text-muted-foreground">${post.position.amount.toLocaleString()} invested</p>
                    </div>
                  </div>
                  <Badge 
                    className={
                      post.position.type === "YES" 
                        ? "bg-success/20 text-success border-success/30" 
                        : "bg-danger/20 text-danger border-danger/30"
                    }
                  >
                    {post.position.type} @ {post.position.price}¢
                  </Badge>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 border-t border-border pt-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 ${likedPosts.has(post.id) ? "text-danger" : ""}`}
                onClick={() => handleLike(post.id)}
              >
                <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                <span className="text-sm">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">{post.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                <Share2 className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Share</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Load More Posts
        </Button>
      </div>
    </div>
  )
}
