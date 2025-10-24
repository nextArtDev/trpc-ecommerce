import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import React, { useActionState } from 'react'
import { shouldPublishedComment } from '../../../lib/actions/comments'

type Props = {
  id: string
  shouldBePublished: boolean
}

const PublishedButton = ({ id, shouldBePublished }: Props) => {
  const path = usePathname()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [publishState, publishAction] = useActionState(
    shouldPublishedComment.bind(null, path, id as string),
    {
      errors: {},
    }
  )

  return (
    <form action={publishAction}>
      <Button
        variant={shouldBePublished === false ? 'destructive' : 'secondary'}
      >
        {shouldBePublished === false ? 'منتشر شده' : 'انتشار'}
      </Button>
    </form>
  )
}

export default PublishedButton
