'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react' // Using an icon for completed steps
import { useTranslations } from 'next-intl'

const CheckoutSteps = ({ current = 0 }) => {
  // 2. GET THE TRANSLATION FUNCTION FOR THE 'checkout' NAMESPACE
  const t = useTranslations('checkout')

  // 3. DEFINE THE KEYS FOR YOUR STEPS
  const stepKeys = ['step1', 'step2', 'step3'] as const

  // 4. MAP OVER THE KEYS TO GET THE TRANSLATED TEXT
  const steps = stepKeys.map((key) => t(key))

  return (
    <div className="flex w-full items-start max-w-xl mx-auto py-4">
      {steps.map((step, index) => (
        // 5. USE THE ORIGINAL KEY FOR THE FRAGMENT KEY TO AVOID ISSUES
        <React.Fragment key={stepKeys[index]}>
          {/* Step Item: Circle + Label */}
          <div
            className="flex flex-col items-center gap-2"
            style={{ minWidth: '80px' }}
          >
            {/* The Circle */}
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all duration-300',
                // State: Completed
                index < current && 'border-green-500 bg-green-500 text-white',
                // State: Active
                index === current &&
                  'border-indigo-600 bg-indigo-600 text-white',
                // State: Incomplete
                index > current && 'border-gray-300 bg-white text-gray-400'
              )}
            >
              {/* Show a checkmark for completed steps, otherwise the number */}
              {index < current ? <Check className="h-6 w-6" /> : index + 1}
            </div>

            {/* The Label */}
            <p
              className={cn(
                'text-center text-xs font-medium text-gray-500 transition-colors duration-300 md:text-sm',
                // Active and completed steps have darker text
                index <= current && 'font-semibold text-gray-800'
              )}
            >
              {step}
            </p>
          </div>

          {/* The Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                'mt-5 h-1 flex-1 rounded-full transition-colors duration-300',
                // If the step is completed, the connector is also highlighted
                index < current ? 'bg-green-500' : 'bg-gray-300'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default CheckoutSteps
