'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "destructive"
export type ButtonSize = "sm" | "md" | "lg" | "icon"

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const MotionButton = motion.create("button")

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    
    const variants: Record<ButtonVariant, string> = {
      primary: "bg-brand-primary-500 text-white hover:bg-brand-primary-600 shadow-sm",
      secondary: "bg-white text-ink-900 border border-ink-200 hover:bg-ink-50",
      ghost: "hover:bg-ink-100 hover:text-ink-900",
      accent: "bg-brand-accent-500 text-ink-900 hover:bg-brand-accent-600 font-semibold shadow-sm",
      destructive: "bg-danger text-white hover:bg-danger/90",
    }

    const sizes: Record<ButtonSize, string> = {
      sm: "h-9 rounded-md px-3 text-sm",
      md: "h-11 rounded-md px-8 text-sm",
      lg: "h-12 rounded-lg px-8 text-base",
      icon: "h-10 w-10",
    }

    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"

    const combinedClassName = cn(baseClasses, variants[variant], sizes[size], className)

    if (asChild) {
      return (
        <Slot
          className={combinedClassName}
          ref={ref as React.Ref<HTMLElement>}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        />
      )
    }

    return (
      <MotionButton
        className={combinedClassName}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
