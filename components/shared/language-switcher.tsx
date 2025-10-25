// components/LanguageSwitcherAdvanced.tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Check, Loader2 } from 'lucide-react'

const languages = [
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
]

export default function LanguageSwitcherAdvanced() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const [isPending, setIsPending] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return

    setIsPending(true)

    // Store the preference in localStorage
    if (mounted) {
      localStorage.setItem('preferred-language', newLocale)
    }

    // Get the current path without the locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

    // Navigate to the same path but with the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  if (!mounted) {
    // Return a placeholder to avoid hydration mismatch
    return (
      <Button variant="outline" size="sm" disabled>
        <Globe className="h-4 w-4 mr-2" />
        <Loader2 className="animate-spin" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          <Globe className="h-4 w-4 mr-2" />
          {languages.find((lang) => lang.code === locale)?.flag}{' '}
          {languages.find((lang) => lang.code === locale)?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={locale === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
            {locale === language.code && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
