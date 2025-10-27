'use client'
import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

type ProductProps = {
  description: string | null | undefined
}

const ProductDescription = ({ description }: ProductProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const t = useTranslations('product')

  // This ensures the component is mounted on the client before sanitizing
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Avoid running DOMPurify on the server during the initial render
  if (!isMounted || !description) {
    // You can return a placeholder or null
    return null
  }

  // Now this code will only run on the client
  const sanitizedDescription = DOMPurify.sanitize(description)

  return (
    <div className="flex gap-3">
      <p className="font-semibold">{t('description.title')}:</p>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        className="font-semibold text-justify"
      />
    </div>
  )
}

export default ProductDescription
