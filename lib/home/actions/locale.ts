import { Language } from '@/lib/generated/prisma'
import { headers } from 'next/headers'

export async function getCurrentLocale(): Promise<Language> {
  try {
    const headersList = await headers()
    const pathname =
      headersList.get('x-pathname') || headersList.get('referer') || ''

    // Extract locale from pathname
    const localeMatch = pathname.match(/^\/([a-z]{2})\//)
    const locale = localeMatch ? localeMatch[1] : 'en'

    return locale as Language
  } catch (error) {
    console.error('Failed to get locale:', error)
    return 'en' as Language // Default fallback
  }
}
