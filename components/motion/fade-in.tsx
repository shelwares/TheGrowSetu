"use client"
import * as React from "react"
import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.4,
  direction = "up",
  ...props
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion()

  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: { x: 0, y: 0 },
  }

  if (shouldReduceMotion) {
    return (
      <div className={cn(className)}>
        {children as React.ReactNode}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom ease out for smooth UI feel
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
