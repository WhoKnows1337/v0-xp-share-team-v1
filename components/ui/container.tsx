"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ className, ...props }, ref) => {
  return <div className={cn("max-w-7xl mx-auto w-full", className)} ref={ref} {...props} />
})
Container.displayName = "Container"

export { Container }
