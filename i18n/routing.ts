import { defineRouting } from 'next-intl/routing'
// i18n/routing.ts

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'fa'],

  // Used when no locale matches
  defaultLocale: 'en',
})
