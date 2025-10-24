'use client'
// import { updateProfile } from '@/app/(home)/lib/actions/user.action'
// import { updateProfileSchema } from '@/app/(home)/lib/validators/home'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { updateProfile } from '@/lib/home/actions/user'
import { updateProfileSchema } from '@/lib/home/schemas'

import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type Props = {
  initialData?: {
    name: string
    phoneNumber: string
  }
}
const ProfileForm = ({ initialData }: Props) => {
  const { data: session } = authClient.useSession()

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      phoneNumber: initialData?.phoneNumber ?? '',
    },
  })

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile(values)

    if (!res.success) {
      return toast.error(res.message)
    }
    await authClient.updateUser({
      // phoneNumber:values.phoneNumber,
      name: values.name,
    })

    toast(res.message)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            // disabled
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    disabled
                    placeholder="شماره موبایل"
                    className="input-field text-right"
                    {...field}
                    dir="ltr"
                    defaultValue={session?.user.phoneNumber ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="نام و نام‌خانوادگی"
                    className="input-field"
                    {...field}
                    defaultValue={session?.user.name ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="button col-span-2 w-full my-12"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'درحال تایید' : 'ویرایش'}
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm
