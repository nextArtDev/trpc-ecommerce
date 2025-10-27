'use client'

import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Facebook, Instagram, Linkedin, Send, Twitter } from 'lucide-react'
import * as React from 'react'
import { TransitionLink } from './TransitionLink'
import { STORE_NAME } from '@/constants/store'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

export default function Footer() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  const locale = useLocale()
  const t = useTranslations('footer')

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              {t('quickLinks.title')}
            </h3>
            <nav className="space-y-2 text-sm">
              <TransitionLink
                href={`/${locale}`}
                className="block transition-colors hover:text-primary"
              >
                {t('quickLinks.home')}
              </TransitionLink>
              <TransitionLink
                href={`/${locale}/products`}
                className="block transition-colors hover:text-primary"
              >
                {t('quickLinks.products')}
              </TransitionLink>
              <TransitionLink
                href={`/${locale}/about-us`}
                className="block transition-colors hover:text-primary"
              >
                {t('quickLinks.about')}
              </TransitionLink>
              <TransitionLink
                href={`/${locale}/contact-us`}
                className="block transition-colors hover:text-primary"
              >
                {t('quickLinks.contact')}
              </TransitionLink>
              <TransitionLink
                href={`/${locale}/faq`}
                className="block transition-colors hover:text-primary"
              >
                {t('quickLinks.faq')}
              </TransitionLink>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('contact.title')}</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>{t('contact.address')}</p>
              <p>{t('contact.city')}</p>
              <p>{t('contact.phone')}</p>
              <p>{t('contact.email')}</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">
              {t('followUs.title')}
            </h3>
            <div className="mb-6 flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      aria-label={t('followUs.facebook')}
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">{t('followUs.facebook')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('followUs.facebookTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      aria-label={t('followUs.twitter')}
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">{t('followUs.twitter')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('followUs.twitterTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      aria-label={t('followUs.instagram')}
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">{t('followUs.instagram')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('followUs.instagramTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      aria-label={t('followUs.linkedin')}
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">{t('followUs.linkedin')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('followUs.linkedinTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="w-fit p-1">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('copyright')}.{' '}
            {t('allRightsReserved')}.
          </p>
          <nav className="flex gap-4 text-sm">
            <TransitionLink
              href={`/${locale}/privacy-policy`}
              className="transition-colors hover:text-primary"
            >
              {t('legal.privacyPolicy')}
            </TransitionLink>
            <TransitionLink
              href={`/${locale}/terms-of-service`}
              className="transition-colors hover:text-primary"
            >
              {t('legal.termsOfService')}
            </TransitionLink>
            <TransitionLink
              href={`/${locale}/cookie-settings`}
              className="transition-colors hover:text-primary"
            >
              {t('legal.cookieSettings')}
            </TransitionLink>
          </nav>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 rounded-lg border bg-background p-4 shadow-lg">
          <h4 className="mb-4 text-lg font-semibold">{t('chat.title')}</h4>
          <div className="mb-4 h-40 overflow-y-auto rounded border p-2">
            <p className="mb-2">
              <strong>{t('chat.support')}:</strong> {t('chat.welcomeMessage')}
            </p>
          </div>
          <form className="flex gap-2">
            <Textarea placeholder={t('chat.placeholder')} className="grow" />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">{t('chat.send')}</span>
            </Button>
          </form>
        </div>
      )}
      <div className="w-full flex mt-4 items-center justify-center">
        <h1 className="text-center text-3xl md:text-5xl lg:text-[10rem] font-bold bg-clip-text text-transparent bg-linear-to-b from-neutral-700 to-neutral-900 select-none">
          {STORE_NAME}
        </h1>
      </div>
    </footer>
  )
}
