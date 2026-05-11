"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type DynamicBreadcrumbProps = {
  className?: string
}

export default function DynamicBreadcrumb({ className }: DynamicBreadcrumbProps) {
  const pathname = usePathname()

  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .slice(-2)

  return (
    <Breadcrumb >
      <BreadcrumbList className={className}>
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/")
          const isLast = index === pathSegments.length - 1

          const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())

          return (
            <BreadcrumbItem key={href} className="flex items-center">
              {index !== 0 && <BreadcrumbSeparator />}

              {isLast ? (
                <BreadcrumbPage className="ml-2">
                  {label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href}>{label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}