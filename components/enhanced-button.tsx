"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface EnhancedButtonProps extends React.ComponentProps<typeof Button> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary"
  glow?: boolean
  lift?: boolean
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant = "default", glow = false, lift = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant === "primary" ? "default" : variant}
        className={cn(
          "transition-all duration-300 ease-out",
          variant === "primary" && "btn-primary bg-primary hover:bg-primary/90",
          glow && "hover-glow",
          lift && "hover-lift",
          className,
        )}
        {...props}
      />
    )
  },
)

EnhancedButton.displayName = "EnhancedButton"
