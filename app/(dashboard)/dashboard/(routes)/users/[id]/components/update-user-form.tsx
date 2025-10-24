'use client'

import { updateUser } from '@/app/(dashboard)/dashboard/lib/actions/user'
import { updateUserSchema } from '@/app/(dashboard)/dashboard/lib/schemas'
import { handleServerErrors } from '@/app/(dashboard)/dashboard/lib/server-utils'
// import { updateUser } from '@/app/(home)/lib/actions/user.action'
// import { USER_ROLES } from '@/app/(home)/lib/constants'
// import { updateUserSchema } from '@/app/(home)/lib/validators/home'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User } from '@/lib/generated/prisma'
// import { useToast } from '@/hooks/use-toast'
// import { updateUser } from '@/lib/actions/user.actions';
// import { updateUserSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const UpdateUserForm = ({ user }: { user: User }) => {
  const path = usePathname()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      phoneNumber: user.phoneNumber || '',
      role: user.role,
    },
  })

  const onSubmit = async (data: z.infer<typeof updateUserSchema>) => {
    startTransition(async () => {
      try {
        // const res = await updateUser({
        //   ...values,
        //   id: user.id,
        // })

        const res = await updateUser(data, user.id, path)
        if (res?.errors) handleServerErrors(res.errors, form.setError)
      } catch (error) {
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
          return
        }
        toast.error('مشکلی پیش آمده، لطفا دوباره امتحان کنید!')
      }
    })
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                'phoneNumber'
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>شماره</FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    placeholder="وارد کردن شماره"
                    {...field}
                    aria-disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Name */}
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                'name'
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>نام</FormLabel>
                <FormControl>
                  <Input placeholder="نام خود را وارد کنید" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Role */}
        <div>
          <FormField
            control={form.control}
            name="role"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                'role'
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>نقش</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="یک نقش را انتخاب کنید" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['admin', 'USER'].map((role) => (
                      <SelectItem key={role} value={role}>
                        {role === 'admin' ? 'ادمین' : 'کاربر'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-between mt-6">
          <Button type="submit" className="w-full" disabled={isPending}>
            {form.formState.isSubmitting ? 'در حال تایید...' : 'آپدیت کاربر'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UpdateUserForm
