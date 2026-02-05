"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Tag, X, Search, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock markets for tagging
const mockMarkets = [
  { id: "btc-150k", title: "BTC reaches $150K by March 2026?", yesPrice: 67, category: "Crypto" },
  { id: "fed-cuts", title: "Fed cuts rates in Q1 2026?", yesPrice: 45, category: "Economics" },
  { id: "starship", title: "SpaceX Starship orbital success?", yesPrice: 78, category: "Science" },
  { id: "eth-flip", title: "ETH flips BTC market cap?", yesPrice: 12, category: "Crypto" },
]

export function CreatePostDialog() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [taggedMarkets, setTaggedMarkets] = useState<typeof mockMarkets>([])
  const [showMarketSearch, setShowMarketSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMarkets = mockMarkets.filter(
    (market) =>
      market.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !taggedMarkets.find((tm) => tm.id === market.id)
  )

  const handleAddMarket = (market: typeof mockMarkets[0]) => {
    setTaggedMarkets([...taggedMarkets, market])
    setSearchQuery("")
    setShowMarketSearch(false)
  }

  const handleRemoveMarket = (marketId: string) => {
    setTaggedMarkets(taggedMarkets.filter((m) => m.id !== marketId))
  }

  const handlePost = () => {
    // In production, send to API
    console.log("[v0] Creating post:", { content, taggedMarkets })
    setContent("")
    setTaggedMarkets([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>
            Share your insights and tag related prediction markets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Post Content */}
          <div>
            <Textarea
              placeholder="What's your prediction? Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.length} / 500 characters
            </p>
          </div>

          {/* Tagged Markets */}
          {taggedMarkets.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tagged Markets</label>
              <div className="space-y-2">
                {taggedMarkets.map((market) => (
                  <div
                    key={market.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-2"
                  >
                    <Tag className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{market.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-xs">{market.category}</Badge>
                        <span className="text-xs text-success">YES {market.yesPrice}¢</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveMarket(market.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Market Button/Search */}
          {!showMarketSearch ? (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setShowMarketSearch(true)}
            >
              <Tag className="h-4 w-4" />
              Tag a Market
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  autoFocus
                />
              </div>
              
              {searchQuery && (
                <div className="max-h-[200px] overflow-y-auto space-y-2 rounded-lg border border-border bg-secondary/30 p-2">
                  {filteredMarkets.length > 0 ? (
                    filteredMarkets.map((market) => (
                      <button
                        key={market.id}
                        onClick={() => handleAddMarket(market)}
                        className="w-full flex items-center gap-2 rounded-lg border border-border bg-card p-2 hover:border-primary/50 transition-colors text-left"
                      >
                        <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{market.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="secondary" className="text-xs">{market.category}</Badge>
                            <span className="text-xs text-success">YES {market.yesPrice}¢</span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No markets found
                    </p>
                  )}
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMarketSearch(false)
                  setSearchQuery("")
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={!content.trim() || content.length > 500}
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
