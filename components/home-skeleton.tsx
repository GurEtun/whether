export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="h-8 w-32 bg-accent animate-pulse rounded" />
          <div className="hidden md:flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 w-20 bg-accent animate-pulse rounded" />
            ))}
          </div>
          <div className="h-9 w-28 bg-accent animate-pulse rounded" />
        </div>
      </header>

      <main>
        {/* Hero Section Skeleton */}
        <section className="border-b border-border py-12 sm:py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <div className="h-12 w-3/4 bg-accent animate-pulse rounded" />
                <div className="h-6 w-full bg-accent animate-pulse rounded" />
                <div className="h-6 w-5/6 bg-accent animate-pulse rounded" />
                <div className="flex gap-3">
                  <div className="h-10 w-32 bg-accent animate-pulse rounded" />
                  <div className="h-10 w-32 bg-accent animate-pulse rounded" />
                </div>
              </div>
              <div className="h-64 bg-accent animate-pulse rounded-xl" />
            </div>
          </div>
        </section>

        {/* Market Categories Skeleton */}
        <section className="border-b border-border py-12">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 w-32 bg-accent animate-pulse rounded-full shrink-0" />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Markets Skeleton */}
        <section className="border-b border-border py-12">
          <div className="container mx-auto px-4">
            <div className="h-8 w-48 bg-accent animate-pulse rounded mb-6" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4">
                  <div className="h-5 w-20 bg-accent animate-pulse rounded mb-3" />
                  <div className="h-6 w-full bg-accent animate-pulse rounded mb-4" />
                  <div className="h-10 w-24 bg-accent animate-pulse rounded mb-4" />
                  <div className="h-4 w-full bg-accent animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Markets Skeleton */}
        <section className="border-b border-border py-12">
          <div className="container mx-auto px-4">
            <div className="h-8 w-48 bg-accent animate-pulse rounded mb-6" />
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-[280px] rounded-xl border border-border bg-card p-4 shrink-0">
                  <div className="h-5 w-16 bg-accent animate-pulse rounded mb-3" />
                  <div className="h-10 bg-accent animate-pulse rounded mb-4" />
                  <div className="flex justify-between">
                    <div className="h-8 w-16 bg-accent animate-pulse rounded" />
                    <div className="flex gap-2">
                      <div className="h-7 w-12 bg-accent animate-pulse rounded" />
                      <div className="h-7 w-12 bg-accent animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Sections Placeholder */}
        <div className="space-y-12 py-12">
          {[...Array(3)].map((_, i) => (
            <section key={i} className="border-b border-border py-12">
              <div className="container mx-auto px-4">
                <div className="h-8 w-64 bg-accent animate-pulse rounded mb-6" />
                <div className="space-y-4">
                  <div className="h-24 bg-accent animate-pulse rounded" />
                  <div className="h-24 bg-accent animate-pulse rounded" />
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-5 w-24 bg-accent animate-pulse rounded" />
                <div className="h-4 w-32 bg-accent animate-pulse rounded" />
                <div className="h-4 w-28 bg-accent animate-pulse rounded" />
                <div className="h-4 w-36 bg-accent animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
