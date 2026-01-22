import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Whether?",
      answer:
        "Whether is a social prediction market platform built on Solana. It allows you to trade on the outcomes of real-world events across politics, sports, crypto, and more, with AI-powered analysis and community discussions.",
    },
    {
      question: "How does prediction market trading work?",
      answer:
        "You buy shares representing YES or NO outcomes for specific events. If your prediction is correct, your shares are redeemed for $1 each. The price reflects the market's probability estimate for that outcome.",
    },
    {
      question: "What blockchain does Whether use?",
      answer:
        "Whether is built on Solana blockchain. This provides fast, secure, and transparent on-chain execution with low fees.",
    },
    {
      question: "How do I get started?",
      answer:
        "Connect your Solana wallet, deposit funds, and start trading on any active market. Browse markets by category, analyze the odds, and place your trades. Track all your positions in the Portfolio page.",
    },
    {
      question: "What are market orders vs limit orders?",
      answer:
        "Market orders execute immediately at the current best price. Limit orders let you specify your desired price and will only execute when the market reaches that price. Use limit orders for better price control.",
    },
    {
      question: "What happens when a market closes?",
      answer:
        "When a market closes, no new trades can be placed. Once the outcome is determined and finalized, winning shares can be redeemed for $1 each in the Portfolio page. Losing shares become worthless.",
    },
    {
      question: "What is slippage tolerance?",
      answer:
        "Slippage is the difference between expected and actual execution price. Setting a slippage tolerance protects you from trades executing at worse prices than anticipated due to market movements.",
    },
    {
      question: "Are there any fees?",
      answer:
        "Trading fees vary by market and are displayed before you confirm trades. There are also Solana network fees (priority fees) for transaction processing. No withdrawal fees.",
    },
    {
      question: "How are markets resolved?",
      answer:
        "Markets go through four states: Active (trading open), Closed (no new trades), Determined (outcome decided), and Finalized (ready for redemption). Resolution sources are specified in each market's details.",
    },
    {
      question: "Is my money safe?",
      answer:
        "Whether uses non-custodial, on-chain smart contracts on Solana. You maintain full custody through your wallet. All trades are transparent and verifiable on-chain. Always do your own research and only trade what you can afford to lose.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Everything you need to know about Whether</p>
        </div>

        <Card className="border-border bg-card p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border last:border-0">
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card className="mt-8 border-border bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 text-center">
          <h3 className="mb-2 text-xl font-bold text-foreground">Still have questions?</h3>
          <p className="mb-4 text-muted-foreground">Join our community for support and discussions</p>
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Join Discord
          </a>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
