'use client'

import Link from 'next/link'
import React from 'react' // Import React to use Fragment

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { FC } from 'react'

interface BreadcrumbProps {
  links: { id: string; label: string; href: string }[]
}

const ProductBreadcrumb: FC<BreadcrumbProps> = ({ links }) => {
  return (
    <Breadcrumb className="pt-4 pr-8">
      <BreadcrumbList>
        {links.map((link, i) => (
          // Use a React Fragment with a key to group the item and separator
          <React.Fragment key={link.id}>
            <BreadcrumbItem>
              {i < links.length - 1 ? (
                // This is a link, not the last item
                <BreadcrumbLink asChild>
                  <Link href={link.href}>{link.label}</Link>
                </BreadcrumbLink>
              ) : (
                // This is the current page, the last item
                <BreadcrumbPage>{link.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {/* Render the separator AFTER the item, but only if it's not the last one */}
            {i < links.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default ProductBreadcrumb
