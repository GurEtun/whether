"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TrendingUp, Landmark, Trophy, Bitcoin, BarChart3, Clapperboard, Globe, Microscope } from "lucide-react"

const categories = [
  { id: "all", label: "All Markets", icon: TrendingUp, count: 523 },
  { id: "politics", label: "Politics", icon: Landmark, count: 89 },
  { id: "sports", label: "Sports", icon: Trophy, count: 156 },
  { id: "crypto", label: "Crypto", icon: Bitcoin, count: 94 },
  { id: "economics", label: "Economics", icon: BarChart3, count: 67 },
  { id: "entertainment", label: "Entertainment", icon: Clapperboard, count: 42 },
  { id: "world", label: "World Events", icon: Globe, count: 51 },
  { id: "science", label: "Science & Tech", icon: Microscope, count: 24 },
]

export function MarketCategories() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <section className="border-b border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id

            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={`shrink-0 gap-2 ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {category.count}
                </span>
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
