import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        // Custom variants for categories and statuses based on image
        category: "border-transparent bg-slate-100 text-slate-900 font-medium",
        success: "border-transparent bg-emerald-50 text-emerald-700 font-medium",
        info: "border-transparent bg-blue-50 text-blue-700 font-medium",
        warning: "border-transparent bg-amber-50 text-amber-900 font-medium",
        danger: "border-transparent bg-red-50 text-red-700 font-medium",
        // Offer - List (Type pill variants) - intentionally no hover styles
        typeDark:
          "border-transparent bg-slate-900 text-white font-semibold",
        typeLight:
          "border-transparent bg-slate-100 text-slate-900 font-semibold",
        typeOutline:
          "border-slate-200 bg-white text-slate-900 font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
