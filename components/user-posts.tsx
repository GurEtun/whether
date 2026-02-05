"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, MessageSquare, Heart, Share2, Tag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Mock posts data
const mockPosts = [
  {
    id: 1,
    content: "Just placed a big YES position on BTC hitting $150K by March. The technical indicators are looking bullish and institutional adoption is accelerating. 📈",
    taggedMarkets: [
      { id: "btc-150k", title: "BTC reaches $150K by March 2026?", yesPrice: 67 }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    likes: 24,
    comments: 8,
    position: { type: "YES", amount: 500, price: 67 }
  },
  {
    id: 2,
    content: "Interesting to see the Fed rate cut market moving. I'm staying on the NO side for Q1 2026 - inflation data still too high IMO.",
    taggedMarkets: [
      { id: "fed-cuts", title: "Fed cuts rates in Q1 2026?", yesPrice: 45 }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    likes: 15,
    comments: 12,
    position: { type: "NO", amount: 250, price: 55 }
  },
]

export function UserPosts() {
  return (
    <div className="space-y-4">
      {mockPosts.map((post) => (
        <Card key={post.id} className="p-4 sm:p-6 border-border bg-card hover:border-primary/30 transition-colors">
          {/* Post Header */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                TR
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-foreground">You</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </span>
              </div>
              <p className="text-foreground leading-relaxed">{post.content}</p>
            </div>
          </div>

          {/* Tagged Markets */}
          {post.taggedMarkets.length > 0 && (
            <div className="mb-4 space-y-2">
              {post.taggedMarkets.map((market) => (
                <div
                  key={market.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <Tag className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{market.title}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      YES {market.yesPrice}¢
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Position Info */}
          {post.position && (
            <div className="mb-4 rounded-lg border border-border bg-gradient-to-r from-primary/10 to-secondary/10 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Your Position</span>
                </div>
                <Badge className={post.position.type === "YES" ? "bg-success text-success-foreground" : "bg-danger text-danger-foreground"}>
                  {post.position.type} @ {post.position.price}¢
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                ${post.position.amount} invested
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 border-t border-border pt-3">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="text-sm">{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">{post.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 ml-auto">
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </Button>
          </div>
        </Card>
      ))}

      {mockPosts.length === 0 && (
        <Card className="p-12 text-center border-border bg-card">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
          <p className="text-sm text-muted-foreground">
            Share your predictions and insights with the community
          </p>
        </Card>
      )}
    </div>
  )
}
