import CartContainer from '@/app/(home)/cart/components/CartContainer'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet'
import { useCartStore } from '@/hooks/useCartStore'

type Props = {
  isOpen: boolean
  onClose: (open: boolean) => void
}

const CartSheet = ({ isOpen, onClose }: Props) => {
  const { totalItems, totalPrice } = useCartStore()
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col bg-red-400 ">
        {!!totalItems ? (
          <>
            <ScrollArea dir="rtl" className=" h-screen px-1">
              <CartContainer />
            </ScrollArea>

            <SheetFooter>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <Button className="w-full">Proceed to Checkout</Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300 mb-4"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h3 className="text-xl font-semibold">سبد خرید شما خالی</h3>
            <p className="text-gray-500 mt-2">
              Add some products to get started!
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet
{
  /* <CartContainer /> */
}
