import { Metadata } from "next"
import { SocialFeed } from "@/components/social-feed"

export const metadata: Metadata = {
  title: "Browse - Whether",
  description: "Browse predictions and insights from the community",
}

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse</h1>
          <p className="text-muted-foreground">
            See what the community is predicting and their insights
          </p>
        </div>
        
        <SocialFeed />
      </div>
    </main>
  )
}
