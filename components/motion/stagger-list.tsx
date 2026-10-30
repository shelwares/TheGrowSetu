"use client"
import * as React from "react"
import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StaggerListProps extends HTMLMotionProps<"div"> {
  staggerDelay?: number
}

export function StaggerList({
  children,
  className,
  staggerDelay = 0.04, // Slightly faster than before for snappier mobile feel
  ...props
}: StaggerListProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className={cn(className)}>
        {children as React.ReactNode}
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className={cn(className)}>
        {children as React.ReactNode}
      </div>
    )
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
