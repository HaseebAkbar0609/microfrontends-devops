"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Translate } from "@/utils/translation/translate"

type DynamicBreadcrumbProps = {
  className?: string
  separator?: ReactNode
  segmentLabelMap?: Record<string, string>
  includeRoot?: boolean
  rootLabel?: ReactNode
  rootHref?: string
  items?: Array<{
    label: ReactNode
    href?: string
  }>
}

export default function DynamicBreadcrumb({
  className,
  separator = "/", // default separator
  segmentLabelMap,
  includeRoot = false,
  rootLabel,
  rootHref = "/",
  items,
}: DynamicBreadcrumbProps) {
  const pathname = usePathname()

  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .slice(-2)

  const hasSegments = pathSegments.length > 0
  const showRoot = includeRoot && rootLabel != null

  if (items && items.length > 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList className={className}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <BreadcrumbItem key={index} className="flex items-center">
                {index !== 0 && (
                  <BreadcrumbSeparator>
                    {separator}
                  </BreadcrumbSeparator>
                )}
                {isLast || !item.href ? (
                  <BreadcrumbPage className="ml-2">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className={className}>
        {showRoot && (
          <BreadcrumbItem className="flex items-center">
            {hasSegments ? (
              <BreadcrumbLink asChild>
                <Link href={rootHref}>{rootLabel}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{rootLabel}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        )}
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/")
          const isLast = index === pathSegments.length - 1

          const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
          const labelKey = segmentLabelMap?.[segment]
          const labelNode = labelKey ? <Translate text={labelKey} /> : label

          return (
            <BreadcrumbItem key={href} className="flex items-center">
              {(index !== 0 || showRoot) && (
                <BreadcrumbSeparator>
                  {separator}
                </BreadcrumbSeparator>
              )}

              {isLast ? (
                <BreadcrumbPage className="ml-2">
                  {labelNode}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href}>{labelNode}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
