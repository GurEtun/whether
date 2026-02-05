import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MarketCardSkeleton() {
  return (
    <Card className="p-4 border-border bg-card">
      <div className="space-y-3">
        {/* Header with category and volume */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />

        {/* Price buttons */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  )
}
