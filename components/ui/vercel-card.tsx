import * as React from "react"
import { cn } from "@/lib/utils"

const VercelCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20",
        className,
      )}
      {...props}
    />
  ),
)
VercelCard.displayName = "VercelCard"

const VercelCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
VercelCardHeader.displayName = "VercelCardHeader"

const VercelCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
VercelCardTitle.displayName = "VercelCardTitle"

const VercelCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
VercelCardDescription.displayName = "VercelCardDescription"

const VercelCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
VercelCardContent.displayName = "VercelCardContent"

const VercelCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
VercelCardFooter.displayName = "VercelCardFooter"

export { VercelCard, VercelCardHeader, VercelCardFooter, VercelCardTitle, VercelCardDescription, VercelCardContent }
