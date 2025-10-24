// 'use client'

// import React, { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { z } from 'zod'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Progress } from '@/components/ui/progress'
// import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'
// import { otpInFormSchema, signInFormSchema } from '@/app/(auth)/lib/schemas'

// // Combine all schemas for the final form data
// const formSchema = z.object({
//   ...signInFormSchema.shape,
//   ...otpInFormSchema.shape,
// })

// type FormData = z.infer<typeof formSchema>

// interface MultiStepFormProps {
//   className?: string
//   onSubmit?: (data: FormData) => void
// }

// export default function MultiStepForm({
//   className,
//   onSubmit,
// }: MultiStepFormProps) {
//   const [step, setStep] = useState(0)
//   const [formData, setFormData] = useState<Partial<FormData>>({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isComplete, setIsComplete] = useState(false)

//   // Define the steps
//   const steps = [
//     {
//       id: 'phone',
//       title: 'شماره تلفن',
//       description: 'شماره موبایل خود را وارد کنید',
//       schema: signInFormSchema,
//       fields: [
//         {
//           name: 'phone',
//           label: 'شماره موبایل',
//           type: 'text',
//           placeholder: '09352310831',
//         },
//       ],
//     },
//     {
//       id: 'code',
//       title: 'کد تایید',
//       description: 'کد تایید را وارد کنید:',
//       schema: otpInFormSchema,
//       fields: [
//         {
//           name: 'code',
//           label: 'کد تایید',
//           type: 'text',
//           placeholder: '******',
//         },
//       ],
//     },
//   ]

//   // Get the current step schema
//   const currentStepSchema = steps[step].schema

//   // Setup form with the current step schema
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<any>({
//     resolver: zodResolver(currentStepSchema as z.ZodType<any>),
//     defaultValues: formData,
//   })

//   // Calculate progress percentage
//   const progress = ((step + 1) / steps.length) * 100

//   // Handle next step
//   const handleNextStep = (data: any) => {
//     const updatedData = { ...formData, ...data }
//     setFormData(updatedData)

//     if (step < steps.length - 1) {
//       setStep(step + 1)
//       // Reset form with the updated data for the next step
//       reset(updatedData)
//     } else {
//       // Final step submission
//       setIsSubmitting(true)
//       setTimeout(() => {
//         if (onSubmit) {
//           onSubmit(updatedData as FormData)
//         }
//         setIsComplete(true)
//         setIsSubmitting(false)
//       }, 1500)
//     }
//   }

//   // Handle previous step
//   const handlePrevStep = () => {
//     if (step > 0) {
//       setStep(step - 1)
//     }
//   }

//   // Animation variants
//   const variants = {
//     hidden: { opacity: 0, x: 50 },
//     visible: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: -50 },
//   }

//   return (
//     <div
//       className={cn(
//         'w-full max-w-md mx-auto p-6 rounded-lg shadow-lg bg-card/40',
//         className
//       )}
//     >
//       {!isComplete ? (
//         <>
//           {/* Progress bar */}
//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               <span className="text-sm font-medium">
//                 Step {step + 1} of {steps.length}
//               </span>
//               <span className="text-sm font-medium">
//                 {Math.round(progress)}%
//               </span>
//             </div>
//             <Progress value={progress} className="h-2" />
//           </div>

//           {/* Step indicators */}
//           <div className="flex justify-between mb-8">
//             {steps.map((s, i) => (
//               <div key={s.id} className="flex flex-col items-center">
//                 <div
//                   className={cn(
//                     'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
//                     i < step
//                       ? 'bg-primary text-primary-foreground'
//                       : i === step
//                       ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
//                       : 'bg-secondary text-secondary-foreground'
//                   )}
//                 >
//                   {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
//                 </div>
//                 <span className="text-xs mt-1 hidden sm:block">{s.title}</span>
//               </div>
//             ))}
//           </div>

//           {/* Form */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={step}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               variants={variants}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="mb-6">
//                 <h2 className="text-xl font-bold">{steps[step].title}</h2>
//                 <p className="text-sm text-muted-foreground">
//                   {steps[step].description}
//                 </p>
//               </div>

//               <form
//                 onSubmit={handleSubmit(handleNextStep)}
//                 className="space-y-4"
//               >
//                 {steps[step].fields.map((field) => (
//                   <div key={field.name} className="space-y-2">
//                     <Label htmlFor={field.name}>{field.label}</Label>
//                     <Input
//                       id={field.name}
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       {...register(field.name as any)}
//                       className={cn(
//                         errors[field.name as string] && 'border-destructive'
//                       )}
//                     />
//                     {errors[field.name as string] && (
//                       <p className="text-sm text-destructive">
//                         {errors[field.name as string]?.message as string}
//                       </p>
//                     )}
//                   </div>
//                 ))}

//                 <div className="flex justify-between pt-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handlePrevStep}
//                     disabled={step === 0}
//                     className={cn(step === 0 && 'invisible')}
//                   >
//                     <ArrowLeft className="mr-2 h-4 w-4" /> Back
//                   </Button>
//                   <Button type="submit" disabled={isSubmitting}>
//                     {step === steps.length - 1 ? (
//                       isSubmitting ? (
//                         'Submitting...'
//                       ) : (
//                         'Submit'
//                       )
//                     ) : (
//                       <>
//                         Next <ArrowRight className="ml-2 h-4 w-4" />
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </motion.div>
//           </AnimatePresence>
//         </>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="text-center py-10"
//         >
//           <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
//             <CheckCircle2 className="h-8 w-8 text-primary" />
//           </div>
//           <h2 className="text-2xl font-bold mb-2">Form Submitted!</h2>
//           <p className="text-muted-foreground mb-6">
//             Thank you for completing the form. We&apos;ll be in touch soon.
//           </p>
//           <Button
//             onClick={() => {
//               setStep(0)
//               setFormData({})
//               setIsComplete(false)
//               reset({})
//             }}
//           >
//             Start Over
//           </Button>
//         </motion.div>
//       )}
//     </div>
//   )
// }
