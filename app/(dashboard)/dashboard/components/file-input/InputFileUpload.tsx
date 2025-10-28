//https://www.kibo-ui.com/components/image-crop

'use client'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { X } from 'lucide-react'

import { useFormContext } from 'react-hook-form'

import { FileInput, FileUploader } from './file-input' // Assuming this is your component
import ImageSlider from './ImageSlider'
import { Image } from '@/lib/generated/prisma'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
// Assuming your ImageCropper file is here

// Import the new dialog

export async function dataUrlToFile(
  dataUrl: string,
  filename: string
): Promise<File> {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  return new File([blob], filename, { type: blob.type })
}

const InputFileUpload = ({
  name,
  label = name,
  className,
  multiple = true,
  initialDataImages,
  unoptimized = false,
  isMandatory = true,
}: {
  name: string
  label?: string
  className?: string
  multiple?: boolean
  initialDataImages?: Partial<Image>[] | null
  unoptimized?: boolean
  isMandatory?: boolean
}) => {
  const form = useFormContext()
  const { setValue, getValues } = form

  // This state holds the NEW File objects after cropping.
  const [files, setFiles] = useState<File[]>([])
  // This state tracks whether to show the initial images from the server.
  const [showInitials, setShowInitials] = useState(true)

  // State for the cropping modal/queue
  const [croppingQueue, setCroppingQueue] = useState<File[]>([])
  const [croppingFile, setCroppingFile] = useState<File | null>(null)

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: multiple,
  }

  // --- Process the cropping queue ---
  useEffect(() => {
    if (croppingQueue.length > 0) {
      setCroppingFile(croppingQueue[0])
    } else {
      setCroppingFile(null)
    }
  }, [croppingQueue])

  // --- Create object URLs for previewing NEW files ---
  const newUrls = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file))
  }, [files])

  // --- Sync local `files` state with React Hook Form ---
  useEffect(() => {
    // The form's state should be a standard File array, not a FileList.
    // This aligns with Zod's `z.array()` and standard JS practices.
    const initialValues = getValues(name)
    const combined = [
      ...(Array.isArray(initialValues)
        ? initialValues.filter((v) => !(v instanceof File))
        : []),
      ...files,
    ]

    setValue(name, combined, { shouldValidate: true })
  }, [files, name, setValue, getValues])

  // --- Effect for cleaning up object URLs to prevent memory leaks ---
  useEffect(() => {
    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [newUrls])

  const handleCropComplete = (croppedFile: File) => {
    setFiles((prevFiles) => [...prevFiles, croppedFile])
    setCroppingQueue((prevQueue) => prevQueue.slice(1))
  }

  const handleCropCancel = () => {
    setCroppingQueue((prevQueue) => prevQueue.slice(1))
  }

  const handleClearAllFiles = () => {
    setFiles([])
    setShowInitials(false)
    // Set the form value to an empty array
    setValue(name, [], { shouldValidate: true })
  }

  // URLs for initial data from the server (e.g., when editing)
  const initialUrls =
    showInitials && initialDataImages
      ? (initialDataImages.map((img) => img.url).filter(Boolean) as string[])
      : []

  // Combine initial URLs and new preview URLs for the slider
  const displayUrls = [...initialUrls, ...newUrls]

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={() => (
          <FormItem>
            <FormLabel>
              {label}
              {isMandatory && <span className="text-rose-500">*</span>}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <FileUploader
                  value={null}
                  onValueChange={(droppedFiles: File[] | null) => {
                    if (droppedFiles) {
                      // Convert the FileList to a File[] array immediately.
                      const filesArray = Array.from(droppedFiles)
                      setCroppingQueue((prevQueue) => [
                        ...prevQueue,
                        ...filesArray,
                      ])
                    }
                  }}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  {displayUrls.length > 0 ? (
                    <div className={cn('relative w-60 h-60 ', className)}>
                      <ImageSlider
                        unoptimized={unoptimized}
                        urls={displayUrls}
                      />
                      <Button
                        size="icon"
                        onClick={handleClearAllFiles}
                        className="absolute top-2 left-2 z-20"
                        type="button"
                      >
                        <X className="text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <FileInput className="outline-dashed outline-1 outline-foreground p-5 ">
                      <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                        <FileSvgDraw />
                      </div>
                    </FileInput>
                  )}
                </FileUploader>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <ImageCropperDialog
        file={croppingFile}
        onCrop={handleCropComplete}
        onClose={handleCropCancel}
        aspect={1}
      />
    </>
  )
}
export default InputFileUpload

// FileSvgDraw component remains the same
const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">برای اپلود عکس کلید کرده</span>
        &nbsp; یا عکس را گرفته در این محل رها کنید
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG یا GIF
      </p>
    </>
  )
}

interface ImageCropperDialogProps {
  file: File | null
  aspect?: number
  onCrop: (croppedFile: File) => void
  onClose: () => void
}

export const ImageCropperDialog = ({
  file,
  aspect = 1,
  onCrop,
  onClose,
}: ImageCropperDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (file) {
      setIsOpen(true)
    }
  }, [file])

  const handleCrop = async (croppedImage: string) => {
    if (!file) return
    const newFile = await dataUrlToFile(croppedImage, file.name)
    onCrop(newFile)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تنظیم عکس</DialogTitle>
        </DialogHeader>
        {file && (
          <ImageCrop
            file={file}
            aspect={aspect}
            onCrop={handleCrop}
            maxImageSize={1024 * 1024 * 2} // 2MB
          >
            <div className="flex justify-center items-center my-4">
              <ImageCropContent className="w-full max-h-[50vh]" />
            </div>
            <DialogFooter className="gap-2 sm:justify-end">
              <ImageCropReset asChild>
                <Button variant="outline">ریست</Button>
              </ImageCropReset>
              <ImageCropApply asChild>
                <Button>ثبت</Button>
              </ImageCropApply>
            </DialogFooter>
          </ImageCrop>
        )}
      </DialogContent>
    </Dialog>
  )
}

import { Button } from '@/components/ui/button'
import { CropIcon, RotateCcwIcon } from 'lucide-react'
import { Slot } from 'radix-ui'
import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  forwardRef,
} from 'react'
import ReactCrop, {
  centerCrop,
  // makeAspectCrop,
  type PercentCrop,
  type PixelCrop,
  type ReactCropProps,
} from 'react-image-crop'
import { cn } from '@/lib/utils'

import 'react-image-crop/src/ReactCrop.scss'

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined
): PercentCrop => {
  if (!aspect) {
    return { x: 5, y: 5, width: 90, height: 90, unit: '%' }
  }

  const mediaAspect = mediaWidth / mediaHeight
  let cropWidth: number
  let cropHeight: number

  if (mediaAspect > aspect) {
    // Image is wider than desired aspect ratio
    cropHeight = 90 // Use most of the height
    cropWidth = (cropHeight * aspect * mediaHeight) / mediaWidth
  } else {
    // Image is taller than desired aspect ratio
    cropWidth = 90 // Use most of the width
    cropHeight = (cropWidth * mediaWidth) / (aspect * mediaHeight)
  }

  return centerCrop(
    {
      unit: '%',
      width: Math.min(cropWidth, 90),
      height: Math.min(cropHeight, 90),
    },
    mediaWidth,
    mediaHeight
  )
}
// const getCroppedPngImage = async (

const getCroppedPngImage = async (
  imageSrc: HTMLImageElement,
  pixelCrop: PixelCrop,
  maxImageSize: number,
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  quality: number = 0.92
): Promise<string> => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Context is null, this should never happen.')
  }

  // Calculate scale factors properly
  const scaleX = imageSrc.naturalWidth / imageSrc.width
  const scaleY = imageSrc.naturalHeight / imageSrc.height

  // Set canvas size to the actual crop dimensions in natural image coordinates
  canvas.width = Math.round(pixelCrop.width * scaleX)
  canvas.height = Math.round(pixelCrop.height * scaleY)

  // Enable high-quality image smoothing
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Draw the cropped portion at full resolution
  ctx.drawImage(
    imageSrc,
    Math.round(pixelCrop.x * scaleX), // source x
    Math.round(pixelCrop.y * scaleY), // source y
    Math.round(pixelCrop.width * scaleX), // source width
    Math.round(pixelCrop.height * scaleY), // source height
    0, // destination x
    0, // destination y
    canvas.width, // destination width
    canvas.height // destination height
  )

  // Try different quality settings if file is too large
  let currentQuality = quality
  let croppedImageUrl = ''
  let blob: Blob | null = null

  do {
    croppedImageUrl = canvas.toDataURL(outputFormat, currentQuality)
    const response = await fetch(croppedImageUrl)
    blob = await response.blob()

    if (blob.size <= maxImageSize) {
      break
    }

    // Reduce quality incrementally
    currentQuality -= 0.1
  } while (currentQuality > 0.1)

  // If still too large, try PNG compression
  if (blob && blob.size > maxImageSize && outputFormat !== 'image/png') {
    croppedImageUrl = canvas.toDataURL('image/png')
    const response = await fetch(croppedImageUrl)
    blob = await response.blob()
  }

  return croppedImageUrl
}

type ImageCropContextType = {
  file: File
  maxImageSize: number
  imgSrc: string
  crop: PercentCrop | undefined
  completedCrop: PixelCrop | null
  imgRef: RefObject<HTMLImageElement | null>
  onCrop?: (croppedImage: string) => void
  reactCropProps: Omit<ReactCropProps, 'onChange' | 'onComplete' | 'children'>
  handleChange: (pixelCrop: PixelCrop, percentCrop: PercentCrop) => void
  handleComplete: (
    pixelCrop: PixelCrop,
    percentCrop: PercentCrop
  ) => Promise<void>
  onImageLoad: (e: SyntheticEvent<HTMLImageElement>) => void
  applyCrop: () => Promise<void>
  resetCrop: () => void
}

const ImageCropContext = createContext<ImageCropContextType | null>(null)

const useImageCrop = () => {
  const context = useContext(ImageCropContext)
  if (!context) {
    throw new Error('ImageCrop components must be used within ImageCrop')
  }
  return context
}

export type ImageCropProps = {
  file: File
  maxImageSize?: number
  onCrop?: (croppedImage: string) => void
  children: ReactNode
  onChange?: ReactCropProps['onChange']
  onComplete?: ReactCropProps['onComplete']
} & Omit<ReactCropProps, 'onChange' | 'onComplete' | 'children'>

export const ImageCrop = ({
  file,
  maxImageSize = 1024 * 1024 * 5,
  onCrop,
  children,
  onChange,
  onComplete,
  ...reactCropProps
}: ImageCropProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [imgSrc, setImgSrc] = useState<string>('')
  const [crop, setCrop] = useState<PercentCrop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [initialCrop, setInitialCrop] = useState<PercentCrop>()

  useEffect(() => {
    const reader = new FileReader()
    reader.addEventListener('load', () =>
      setImgSrc(reader.result?.toString() || '')
    )
    reader.readAsDataURL(file)
  }, [file])

  const onImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      const newCrop = centerAspectCrop(width, height, reactCropProps.aspect)
      setCrop(newCrop)
      setInitialCrop(newCrop)
    },
    [reactCropProps.aspect]
  )

  const handleChange = (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    setCrop(percentCrop)
    onChange?.(pixelCrop, percentCrop)
  }

  // biome-ignore lint/suspicious/useAwait: "onComplete is async"
  const handleComplete = async (
    pixelCrop: PixelCrop,
    percentCrop: PercentCrop
  ) => {
    setCompletedCrop(pixelCrop)
    onComplete?.(pixelCrop, percentCrop)
  }

  const applyCrop = async () => {
    if (!(imgRef.current && completedCrop)) {
      return
    }

    const croppedImage = await getCroppedPngImage(
      imgRef.current,
      completedCrop,
      maxImageSize,
      'image/webp', // or 'image/webp' for better compression
      0.95 // High quality
    )

    onCrop?.(croppedImage)
  }

  const resetCrop = () => {
    if (initialCrop) {
      setCrop(initialCrop)
      setCompletedCrop(null)
    }
  }

  const contextValue: ImageCropContextType = {
    file,
    maxImageSize,
    imgSrc,
    crop,
    completedCrop,
    imgRef,
    onCrop,
    reactCropProps,
    handleChange,
    handleComplete,
    onImageLoad,
    applyCrop,
    resetCrop,
  }

  return (
    <ImageCropContext.Provider value={contextValue}>
      {children}
    </ImageCropContext.Provider>
  )
}

export type ImageCropContentProps = {
  style?: CSSProperties
  className?: string
}

export const ImageCropContent = ({
  style,
  className,
}: ImageCropContentProps) => {
  const {
    imgSrc,
    crop,
    handleChange,
    handleComplete,
    onImageLoad,
    imgRef,
    reactCropProps,
  } = useImageCrop()

  const shadcnStyle = {
    '--rc-border-color': 'var(--color-border)',
    '--rc-focus-color': 'var(--color-primary)',
  } as CSSProperties

  return (
    <ReactCrop
      className={cn('max-h-[277px] max-w-full', className)}
      crop={crop}
      onChange={handleChange}
      onComplete={handleComplete}
      style={{ ...shadcnStyle, ...style }}
      {...reactCropProps}
    >
      {imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="crop"
          className="size-full object-contain"
          onLoad={onImageLoad}
          ref={imgRef}
          src={imgSrc}
        />
      )}
    </ReactCrop>
  )
}

export type ImageCropApplyProps = ComponentProps<'button'> & {
  asChild?: boolean
}

export const ImageCropApply = forwardRef<
  HTMLButtonElement,
  ImageCropApplyProps
>(({ asChild = false, children, onClick, ...props }, ref) => {
  const { applyCrop } = useImageCrop()

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    await applyCrop()
    onClick?.(e)
  }

  if (asChild) {
    return (
      // Pass the forwarded ref down to Slot.Root
      <Slot.Root ref={ref} onClick={handleClick} {...props}>
        {children}
      </Slot.Root>
    )
  }

  return (
    // Pass the forwarded ref down to the Button
    <Button
      ref={ref}
      onClick={handleClick}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <CropIcon className="size-4" />}
    </Button>
  )
})
// Add a display name for better debugging
ImageCropApply.displayName = 'ImageCropApply'

export type ImageCropResetProps = ComponentProps<'button'> & {
  asChild?: boolean
}

export const ImageCropReset = forwardRef<
  HTMLButtonElement,
  ImageCropResetProps
>(({ asChild = false, children, onClick, ...props }, ref) => {
  const { resetCrop } = useImageCrop()

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    resetCrop()
    onClick?.(e)
  }

  if (asChild) {
    return (
      // Pass the forwarded ref down to Slot.Root
      <Slot.Root ref={ref} onClick={handleClick} {...props}>
        {children}
      </Slot.Root>
    )
  }

  return (
    // Pass the forwarded ref down to the Button
    <Button
      ref={ref}
      onClick={handleClick}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <RotateCcwIcon className="size-4" />}
    </Button>
  )
})
// Add a display name for better debugging
ImageCropReset.displayName = 'ImageCropReset'
// Keep the original Cropper component for backward compatibility
export type CropperProps = Omit<ReactCropProps, 'onChange'> & {
  file: File
  maxImageSize?: number
  onCrop?: (croppedImage: string) => void
  onChange?: ReactCropProps['onChange']
}

export const Cropper = ({
  onChange,
  onComplete,
  onCrop,
  style,
  className,
  file,
  maxImageSize,
  ...props
}: CropperProps) => (
  <ImageCrop
    aspect={1}
    file={file}
    maxImageSize={maxImageSize}
    onChange={onChange}
    onComplete={onComplete}
    onCrop={onCrop}
    {...props}
  >
    <ImageCropContent className={className} style={style} />
  </ImageCrop>
)
