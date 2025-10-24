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

export default function Footer() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isChatOpen, setIsChatOpen] = React.useState(false)

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Stay Connected
            </h2>
            <p className="mb-6 text-muted-foreground">
              Join our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div> */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">دسترسی سریع</h3>
            <nav className="space-y-2 text-sm">
              <TransitionLink
                href="/"
                className="block transition-colors hover:text-primary"
              >
                خانه
              </TransitionLink>
              <TransitionLink
                href="/products"
                className="block transition-colors hover:text-primary"
              >
                محصولات
              </TransitionLink>
              <TransitionLink
                href="/about-us"
                className="block transition-colors hover:text-primary"
              >
                درباره ما
              </TransitionLink>
              <TransitionLink
                href="/contact-us"
                className="block transition-colors hover:text-primary"
              >
                ارتباط با ما
              </TransitionLink>
              <TransitionLink
                href="/faq"
                className="block transition-colors hover:text-primary"
              >
                سوالات متداول
              </TransitionLink>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">ارتباط با ما</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>123 Innovation Street</p>
              <p>Tech City, TC 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: hello@example.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4   text-lg font-semibold">ما را دنبال کنید</h3>
            <div className="mb-6 flex items-center  space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
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
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
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
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
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
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="w-fit p-1">
              <ThemeSwitcher
              // defaultValue="light"
              // onChange={setTheme}
              // value={theme as 'light' | 'dark' | 'system'}
              />
            </div>
            {/* <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div> */}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Saeid. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <TransitionLink
              href="#"
              className="transition-colors hover:text-primary"
            >
              Privacy Policy
            </TransitionLink>
            <TransitionLink
              href="#"
              className="transition-colors hover:text-primary"
            >
              Terms of Service
            </TransitionLink>
            <TransitionLink
              href="#"
              className="transition-colors hover:text-primary"
            >
              Cookie Settings
            </TransitionLink>
          </nav>
        </div>
      </div>
      {/* <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
      >
        {isChatOpen ? 'Close Chat' : 'Open Chat'}
      </Button> */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 rounded-lg border bg-background p-4 shadow-lg">
          <h4 className="mb-4 text-lg font-semibold">Live Chat</h4>
          <div className="mb-4 h-40 overflow-y-auto rounded border p-2">
            <p className="mb-2">
              <strong>Support:</strong> Hello! How can I assist you today?
            </p>
          </div>
          <form className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      )}
      <div className=" w-full flex mt-4 items-center justify-center   ">
        <h1 className="text-center text-3xl md:text-5xl lg:text-[10rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-900 select-none">
          {STORE_NAME}
        </h1>
      </div>
    </footer>
  )
}
