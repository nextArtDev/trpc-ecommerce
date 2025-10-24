import { Loader } from '@/components/shared/loader'
import React from 'react'

const loading = () => {
  return (
    <section className="relative min-h-screen h-screen w-full flex items-center justify-center">
      <Loader variant="magnetic-dots" size={72} className=" " />
    </section>
  )
}

export default loading
