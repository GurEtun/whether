"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UserProfile } from "@/components/user-profile"
import { UserPosts } from "@/components/user-posts"
import { CreatePostDialog } from "@/components/create-post-dialog"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <UserProfile />
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Activity</h2>
            <CreatePostDialog />
          </div>
          <UserPosts />
        </div>
      </main>
      <Footer />
    </div>
  )
}
