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
import { Globe, Check, Loader2, EllipsisVertical } from 'lucide-react'
import { motion } from 'framer-motion'
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
        <button
          aria-label="language-switcher"
          disabled={isPending}
          className="cursor-pointer flex items-center justify-center px-px! w-10 h-8 bg-background p-0.5"
        >
          {/* <Languages className="h-4 w-4  " /> */}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            whileInView={{ rotateY: ['360deg', '-360deg'] }}
            transition={{
              duration: 1.2,
              delay: 2,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            // style={{ enableBackground: 'new 0 0 128 128' }}
          >
            <path
              style={{ fill: '#f7a944' }}
              d="M68.918 109.572 55.77 96.045v5.635H23.099l16.014 15.8H55.77v5.618l13.148-13.526zM30.019 72.946 16.492 86.094h5.618v14.383h15.817V86.094h5.602l-13.51-13.148zM93.154 75.5l-4.712 14.252h9.276L93.154 75.5zm0 0-4.712 14.252h9.276L93.154 75.5zm0 0-4.712 14.252h9.276L93.154 75.5zm28.272-25.422H83.17V10.685c0-5.421-4.432-9.853-9.869-9.853H9.869C4.432.832 0 5.264 0 10.685v63.992c0 5.437 4.432 9.852 9.869 9.852h4.547v-6.59H9.869a3.273 3.273 0 0 1-3.279-3.262V10.685a3.273 3.273 0 0 1 3.279-3.262h63.432a3.273 3.273 0 0 1 3.279 3.262v39.393H57.995a6.557 6.557 0 0 0-6.08 4.053 88.264 88.264 0 0 1-5.931-5.19C56.858 37.21 58.687 26.238 58.802 25.562l.071-.362h8.694v-4.943H45.292v-7.381h-4.943v7.381H18.074V25.2h35.752c-.395 1.911-2.636 10.693-11.352 20.166-6.426-6.953-9.309-12.456-9.358-12.555l-2.191 1.12-2.208 1.12c.214.412 3.312 6.393 10.248 13.84-4.564 4.218-10.479 8.403-18.14 12.077l2.142 4.448c8.221-3.921 14.581-8.436 19.491-12.966a88.51 88.51 0 0 0 8.963 7.529v17.958h-5.602v6.59h5.602v9.193h4.992v-.28l16.014 16.459-16.014 16.459s-2.059.807 1.582.807h63.432a6.557 6.557 0 0 0 6.574-6.557V56.635a6.559 6.559 0 0 0-6.575-6.557zm-19.309 53.365-2.389-7.447H86.382l-2.455 7.447h-7.908l12.934-36.214h8.551l12.818 36.214h-8.205z"
            />
          </motion.svg>
          <EllipsisVertical className="text-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-none">
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
