'use client';

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TrendingUp } from "lucide-react"

export interface ChartControlsProps {
  resolution: string
  onResolutionChange: (resolution: string) => void
  isLoading?: boolean
}

export function ChartControls({ resolution, onResolutionChange, isLoading = false }: ChartControlsProps) {
  const resolutions = [
    { value: "15m", label: "15m" },
    { value: "1h", label: "1h" },
    { value: "4h", label: "4h" },
    { value: "1d", label: "1d" },
    { value: "1w", label: "1w" },
  ]

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">Price Chart</span>
      </div>

      <ToggleGroup
        type="single"
        value={resolution}
        onValueChange={(value) => {
          if (value) onResolutionChange(value)
        }}
        className="gap-1"
      >
        {resolutions.map((res) => (
          <ToggleGroupItem
            key={res.value}
            value={res.value}
            aria-label={`${res.label} resolution`}
            disabled={isLoading}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {res.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
