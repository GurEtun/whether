import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Bot, TrendingUp } from "lucide-react"

export function SocialAIFeatures() {
  return (
    <section className="py-16 border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-3">
            Understand the Market, Not Just the Price
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Every market on Whether includes community discussion and AI-powered analysis
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Community Discussion</h3>
              <p className="text-sm text-muted-foreground">
                See why others believe YES or NO. Explore arguments, share insights, and understand different perspectives on every market.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI Market Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get summaries of arguments, risks, and recent developments. AI-powered insights help you understand the market context.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Transparent Probabilities</h3>
              <p className="text-sm text-muted-foreground">
                Prices reflect collective belief, not opinions. See how the market's view evolves based on new information and discussion.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground italic">
            Whether helps you explore how beliefs form, not just what the price is.
          </p>
        </div>
      </div>
    </section>
  )
}
