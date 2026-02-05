import { Card } from "@/components/ui/card"

export function BrowseSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-10 w-[300px] bg-accent animate-pulse rounded" />
        <div className="h-10 w-32 bg-accent animate-pulse rounded" />
      </div>

      {/* Feed Skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4 sm:p-6 border-border bg-card">
            {/* User Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-accent animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-24 bg-accent animate-pulse rounded" />
                  <div className="h-4 w-12 bg-accent animate-pulse rounded" />
                  <div className="h-4 w-20 bg-accent animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-accent animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-accent animate-pulse rounded" />
                </div>
              </div>
            </div>

            {/* Media Placeholder */}
            {i % 3 === 0 && (
              <div className="mb-4 h-48 bg-accent animate-pulse rounded-lg" />
            )}

            {/* Tagged Market */}
            <div className="mb-4 h-20 bg-accent animate-pulse rounded-lg" />

            {/* Actions */}
            <div className="flex gap-1 border-t border-border pt-3">
              <div className="h-8 w-16 bg-accent animate-pulse rounded" />
              <div className="h-8 w-16 bg-accent animate-pulse rounded" />
              <div className="h-8 w-16 bg-accent animate-pulse rounded ml-auto" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
