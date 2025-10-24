'use client'

import * as React from 'react'

import { DayPicker } from 'react-day-picker/persian'
import 'react-day-picker/dist/style.module.css'
// import 'react-day-picker/lib/style.css'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { faIR } from 'date-fns/locale'
export type CalendarProps = React.ComponentProps<typeof DayPicker>
import jalaali from 'jalaali-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatCaption: (date: Date, options: any) => string = (date) => {
  const jalaliDate = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  const jalaliMonth = jalaliDate.jm
  const jalaliYear = jalaliDate.jy
  const monthName = getJalaliMonthName(jalaliMonth) // Helper function (see below)

  return `${monthName} ${jalaliYear}`
}

// Helper function to get Jalali month names
const getJalaliMonthName = (month: number): string => {
  const jalaliMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ]
  return jalaliMonths[month - 1]
}

function Calendar({
  // className,
  classNames,
  // showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      formatters={{
        formatCaption: formatCaption, // Use the custom formatCaption function
      }}
      // ISOWeek
      dir="rtl"
      locale={faIR}
      // weekStartsOn={5}
      // showOutsideDays={showOutsideDays}
      modifiersStyles={{
        disabled: {
          opacity: '40%',
        },
        today: { textDecoration: 'underline 3px solid  #a6ff00' },
        hidden: { opacity: '0', pointerEvents: 'none' },
      }}
      // className={cn('text-secondary relative p-3 gradient-base', className)}
      classNames={{
        weekdays:
          'flex pr-2 gap-x-2.5 py-2 border-b border-muted-foreground !font-normal text-sm text-muted-foreground',
        months: 'flex space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1  relative items-center',
        caption_label: 'text-sm font-medium mr-12',
        nav: 'space-x-1  absolute top-2.5 right-3.5 w-3/5 flex flex-row-reverse justify-between',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          ' h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute right-1',
        nav_button_next: 'absolute left-1',
        table: 'w-full   space-y-1',
        chevron: 'fill-primary rounded-full',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100  aria-selected:bg-muted'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-muted text-primary  hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground  ',
        day_today: 'bg-muted text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground ',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={
        {
          // IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
          // IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        }
      }
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
