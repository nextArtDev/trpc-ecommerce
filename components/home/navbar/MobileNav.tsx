'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, easeInOut } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { CurrentUserType, NavigationData } from '@/lib/types/home'
import { TransitionLink } from '../shared/TransitionLink'
import { useTranslations } from 'next-intl'

interface MobileNavProps {
  navigation: NavigationData
  session: CurrentUserType
}

export default function MobileNav({ navigation, session }: MobileNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const t = useTranslations('navigation')
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
        staggerChildren: 0.1,
      },
    },
  }

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName)
  }

  return (
    <>
      <motion.button
        className="text-foreground hover:bg-muted rounded-sm p-2 transition-colors duration-200 lg:hidden cursor-pointer"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileTap={{ scale: 0.95 }}
        aria-label={
          isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
        }
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-navigation-menu"
        aria-haspopup="true"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </motion.button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="border-border bg-background fixed top-16 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto rounded-sm border shadow-2xl lg:hidden"
              style={{
                overflowX: 'hidden', // Prevent horizontal scrolling
                width: 'calc(100vw - 2rem)', // Responsive width
                maxWidth: '320px', // Maximum width
                right: '1rem', // Adjust position
              }}
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-1 p-4">
                {/* Categories with subcategories */}
                {navigation.categories.map((category) => (
                  <div
                    key={category.name}
                    className="border-border border-b last:border-b-0"
                  >
                    <button
                      className="text-foreground hover:bg-muted flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                      onClick={() => toggleCategory(category.name)}
                      aria-expanded={expandedCategory === category.name}
                      aria-controls={`submenu-${category.name
                        .replace(/\s+/g, '-')
                        .toLowerCase()}`}
                      aria-label={`${category.name}, ${
                        expandedCategory === category.name
                          ? t('expanded')
                          : t('collapsed')
                      }`}
                    >
                      <span>{category.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedCategory === category.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {expandedCategory === category.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-muted/30 overflow-hidden"
                        >
                          <div className="space-y-2 py-2 pl-6 pr-4">
                            {category.featured.map((item) => (
                              <TransitionLink
                                key={item.name}
                                prefetch={false}
                                href={item.href}
                                className="text-foreground/80 hover:text-foreground block rounded-lg px-3 py-2 text-sm transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {item.name}
                              </TransitionLink>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Regular pages */}
                {navigation.pages.map((page) => (
                  <motion.div key={page.name} variants={mobileItemVariants}>
                    <TransitionLink
                      prefetch={false}
                      href={page.href}
                      className="text-foreground hover:bg-muted block rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {page.name}
                    </TransitionLink>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="border-border space-y-3 border-t p-4"
                variants={mobileItemVariants}
              >
                {!session?.id ? (
                  <TransitionLink
                    prefetch={false}
                    href="/sign-in"
                    className="text-foreground hover:bg-muted block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('signIn')}
                  </TransitionLink>
                ) : (
                  <TransitionLink
                    prefetch={false}
                    href="/user/profile"
                    className="bg-foreground text-background hover:bg-foreground/90 block w-full rounded-lg py-3 text-center font-medium transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('profile')}
                  </TransitionLink>
                )}
              </motion.div>
              {session?.role === 'admin' && (
                <motion.div
                  className="border-border space-y-3 border-t p-4"
                  variants={mobileItemVariants}
                >
                  <TransitionLink
                    prefetch={false}
                    href="/dashboard"
                    className="text-foreground hover:bg-muted block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('dashboard')}
                  </TransitionLink>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
