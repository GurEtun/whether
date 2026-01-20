"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"

export function DFlowAnimation() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ensure video plays on mount
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("[v0] Video autoplay prevented:", err)
        setError("Click to play")
      })
    }
  }, [])

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.log("[v0] Video error:", e)
    setError("Video failed to load")
  }

  return (
    <section className="w-full bg-card/50 py-8">
      <div className="relative w-full flex items-end justify-center">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 text-white text-sm">
            {error}
          </div>
        )}
        
      </div>
    </section>
  )
}
