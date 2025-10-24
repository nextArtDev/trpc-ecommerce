// 'use client'
// import { useState, useTransition } from 'react'
// import { toast } from 'sonner'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'

// import { Button } from '@/components/ui/button'
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { PhoneInput } from '@/components/ui/phone-input'
// import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
// import { otpInFormSchema, signInFormSchema } from '../../lib/schemas'
// import { authClient } from '@/lib/auth-client'
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from '@/components/ui/input-otp'

// export default function SignInForm() {
//   const [isPending, startTransition] = useTransition()
//   const [step, setStep] = useState('PHONE')
//   const [enteredPhone, setEnteredPhone] = useState('')

//   const phoneForm = useForm<z.infer<typeof signInFormSchema>>({
//     resolver: zodResolver(signInFormSchema),
//     defaultValues: {
//       phone: '',
//     },
//   })

//   const otpForm = useForm<z.infer<typeof otpInFormSchema>>({
//     resolver: zodResolver(otpInFormSchema),
//     defaultValues: {
//       code: '',
//     },
//     mode: 'onChange', // Add this to ensure proper form handling
//   })

//   function onSubmit(values: z.infer<typeof signInFormSchema>) {
//     startTransition(async () => {
//       try {
//         console.log(values)

//         const result = await authClient.phoneNumber.sendOtp({
//           phoneNumber: values.phone,
//         })

//         if (!result.error) {
//           setStep('OTP')
//           setEnteredPhone(values.phone)
//           // Reset OTP form and force clear the field
//           setTimeout(() => {
//             otpForm.reset({ code: '' })
//             otpForm.setValue('code', '') // Force set empty value
//           }, 100) // Small delay to ensure clean state
//           toast.success('کد تایید ارسال شد')
//         } else {
//           toast.error(result.error.message || 'خطا در ارسال کد')
//         }
//       } catch (error) {
//         console.error('Form submission error', error)
//         toast.error('Failed to submit the form. Please try again.')
//       }
//     })
//   }

//   function onOtpSubmit(values: z.infer<typeof otpInFormSchema>) {
//     startTransition(async () => {
//       try {
//         console.log(values)
//         console.log({ enteredPhone })

//         const result = await authClient.phoneNumber.verify({
//           phoneNumber: enteredPhone,
//           code: values.code,
//         })

//         if (!result.error) {
//           toast.success('ورود موفقیت‌آمیز')
//           // Redirect or handle successful login
//           window.location.href = '/dashboard' // or use router.push()
//         } else {
//           toast.error(result.error.message || 'کد وارد شده اشتباه است')
//         }
//       } catch (error) {
//         console.error('Form submission error', error)
//         toast.error('Failed to verify code. Please try again.')
//       }
//     })
//   }

//   // Function to go back to phone step
//   const goBackToPhone = () => {
//     setStep('PHONE')
//     setEnteredPhone('')
//     otpForm.reset({ code: '' }) // Explicitly reset with empty code
//   }

//   if (step === 'PHONE') {
//     return (
//       <Card dir="rtl" className="text-center">
//         <CardTitle>لطفا شماره موبایل خود را وارد کنید.</CardTitle>
//         <CardContent>
//           <Form {...phoneForm}>
//             <form
//               onSubmit={phoneForm.handleSubmit(onSubmit)}
//               className="space-y-8 max-w-3xl mx-auto py-10"
//             >
//               <FormField
//                 control={phoneForm.control}
//                 name="phone"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col items-start">
//                     <FormLabel>شماره موبایل</FormLabel>
//                     <FormControl className="w-full">
//                       <article dir="ltr">
//                         <PhoneInput
//                           placeholder="9352310831"
//                           {...field}
//                           defaultCountry="IR"
//                           disabled={isPending}
//                         />
//                       </article>
//                     </FormControl>
//                     <FormDescription>
//                       شماره موبایل خود را وارد کنید.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button type="submit" className="w-full" disabled={isPending}>
//                 {isPending ? 'در حال ارسال...' : 'ارسال کد تایید'}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//         <CardFooter>کد تایید به این شماره ارسال می‌شود.</CardFooter>
//       </Card>
//     )
//   }

//   return (
//     <Card dir="rtl" className="text-center">
//       <CardTitle>لطفا کد تایید ارسال شده را وارد کنید.</CardTitle>
//       <CardContent>
//         <Form {...otpForm}>
//           <form
//             onSubmit={otpForm.handleSubmit(onOtpSubmit)}
//             className="w-2/3 space-y-6 mx-auto"
//           >
//             <FormField
//               control={otpForm.control}
//               name="code"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>کد تایید</FormLabel>
//                   <FormControl>
//                     <article dir="ltr">
//                       <InputOTP
//                         maxLength={6}
//                         value={field.value || ''}
//                         onChange={(value) => {
//                           // Only allow numeric characters and limit to 6 digits
//                           const numericValue = value
//                             .replace(/\D/g, '')
//                             .slice(0, 6)
//                           console.log('OTP onChange:', numericValue)
//                           field.onChange(numericValue)
//                         }}
//                         onBlur={field.onBlur}
//                         disabled={isPending}
//                         autoComplete="one-time-code" // Proper autocomplete for OTP
//                         inputMode="numeric" // Show numeric keyboard on mobile
//                       >
//                         <InputOTPGroup>
//                           <InputOTPSlot index={0} />
//                           <InputOTPSlot index={1} />
//                           <InputOTPSlot index={2} />
//                           <InputOTPSlot index={3} />
//                           <InputOTPSlot index={4} />
//                           <InputOTPSlot index={5} />
//                         </InputOTPGroup>
//                       </InputOTP>
//                     </article>
//                   </FormControl>
//                   <FormDescription>
//                     کد ۶ رقمی ارسال شده به شماره {enteredPhone} را وارد کنید.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="space-y-2">
//               <Button type="submit" className="w-full" disabled={isPending}>
//                 {isPending ? 'در حال بررسی...' : 'تایید کد'}
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full"
//                 onClick={goBackToPhone}
//                 disabled={isPending}
//               >
//                 تغییر شماره موبایل
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   )
// }
