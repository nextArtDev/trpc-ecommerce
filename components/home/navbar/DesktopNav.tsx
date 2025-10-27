import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Image from 'next/image'
import { CurrentUserType, NavigationData } from '@/lib/types/home'

import { ListItem } from './MainNav'
import { cn } from '@/lib/utils'
import { TransitionLink } from '../shared/TransitionLink'
import { useLocale, useTranslations } from 'next-intl'

type Props = {
  navigation: NavigationData
  session: CurrentUserType
}

const DesktopNav = ({ navigation, session }: Props) => {
  const locale = useLocale()
  const t = useTranslations('navigation')
  const isRTL = locale === 'fa'

  return (
    <div>
      <NavigationMenu dir={isRTL ? 'rtl' : 'ltr'} className="hidden lg:block">
        <NavigationMenuList>
          {navigation.categories.map((category) => (
            <NavigationMenuItem key={category.name}>
              <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-4 gap-6 p-6 w-[600px] lg:w-[800px]">
                  {category.featured.map((item) => (
                    <ListItem
                      key={item.name}
                      title={item.name}
                      href={item.href}
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-md group-hover:opacity-75">
                        <Image
                          unoptimized
                          src={item.imageSrc || '/images/fallback-image.webp'}
                          alt={item.imageAlt}
                          width={200}
                          height={200}
                          className="object-cover object-center"
                        />
                      </div>
                    </ListItem>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
          {navigation.pages.map((page) => (
            <NavigationMenuItem key={page.name}>
              <NavigationMenuLink asChild>
                <TransitionLink
                  href={page.href}
                  className={navigationMenuTriggerStyle()}
                >
                  {page.name}
                </TransitionLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          {session?.id && session?.role === 'admin' && (
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <TransitionLink
                  href={`/${locale}/dashboard`}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'bg-primary text-secondary'
                  )}
                >
                  {t('dashboard')}
                </TransitionLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default DesktopNav
