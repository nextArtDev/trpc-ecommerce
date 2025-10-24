'use client'
import { useRouter } from 'next/navigation'
import { Check, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useTransition } from 'react'

import { createOrder } from '@/lib/home/actions/order'
import { toast } from 'sonner'
import { useCartStore } from '@/hooks/useCartStore'

const PlaceOrderForm = () => {
  const emptyCart = useCartStore((state) => state.emptyCart)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    startTransition(async () => {
      try {
        const res = await createOrder()
        emptyCart()
        // console.log({ res })

        if (res?.redirectTo) {
          router.push(res.redirectTo)
        }
      } catch (error: unknown) {
        // console.error('Order creation failed:', error)
        toast.error(error as string)
      }
    })
  }

  const PlaceOrderButton = () => {
    return (
      <Button
        disabled={isPending}
        className="w-full !cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white"
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{' '}
        تایید
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  )
}

export default PlaceOrderForm
