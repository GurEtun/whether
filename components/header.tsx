"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Menu, X, ChevronDown, TrendingUp, BarChart3 } from "lucide-react"
import { WalletButton } from "@/components/wallet-button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black tracking-tight text-primary italic">Whether</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                  Markets <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/markets" className="flex w-full cursor-pointer items-center">
                    <TrendingUp className="mr-2 h-4 w-4" /> All Markets
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/markets/category/politics" className="flex w-full cursor-pointer">
                    🏛️ Politics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/markets/category/sports" className="flex w-full cursor-pointer">
                    ⚽ Sports
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/markets/category/crypto" className="flex w-full cursor-pointer">
                    💰 Crypto
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/markets/category/economics" className="flex w-full cursor-pointer">
                    📈 Economics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/markets/category/entertainment" className="flex w-full cursor-pointer">
                    🎬 Entertainment
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/browse">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Browse
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Portfolio
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Profile
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Leaderboard
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                  Resources <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/#how-it-works" className="flex w-full cursor-pointer">
                    How It Works
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/faq" className="flex w-full cursor-pointer">
                    FAQ
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                className="w-64 bg-secondary pl-9 text-sm placeholder:text-muted-foreground"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 text-xs text-muted-foreground">
                ⌘K
              </kbd>
            </div>

            {/* Mobile Search Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            <div className="hidden sm:block">
              <WalletButton />
            </div>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="border-t border-border py-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search markets..." className="w-full bg-secondary pl-9" autoFocus />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <Link href="/markets" className="rounded-lg px-3 py-2 text-foreground hover:bg-secondary">
                All Markets
              </Link>
              <Link
                href="/markets/category/politics"
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary"
              >
                🏛️ Politics
              </Link>
              <Link
                href="/markets/category/sports"
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary"
              >
                ⚽ Sports
              </Link>
              <Link
                href="/markets/category/crypto"
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary"
              >
                💰 Crypto
              </Link>
              <Link
                href="/markets/category/economics"
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary"
              >
                📈 Economics
              </Link>
              <Link
                href="/markets/category/entertainment"
                className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary"
              >
                🎬 Entertainment
              </Link>
              <Link href="/browse" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary">
                Browse
              </Link>
              <Link href="/portfolio" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary">
                Portfolio
              </Link>
              <Link href="/profile" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary">
                Profile
              </Link>
              <Link href="/leaderboard" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary">
                Leaderboard
              </Link>
              <div className="mt-2">
                <WalletButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
