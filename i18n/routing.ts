import { defineRouting } from 'next-intl/routing'
// i18n/routing.ts

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['fa', 'en'],

  // Used when no locale matches
  defaultLocale: 'fa',
})
