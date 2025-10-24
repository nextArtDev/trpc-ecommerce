'use client'

// import Image from 'next/image'
import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* <Image
        src="/images/logo.svg"
        width={48}
        height={48}
        alt={` logo`}
        priority={true}
      /> */}
      <div className="p-6 max-w-sm mx-auto rounded-xs shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">پیدا نشد!</h1>
        <p className="text-destructive">صفحه مورد نظر شما پیدا نشد.</p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => (window.location.href = '/')}
        >
          برگشت به صفحه اصلی
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
