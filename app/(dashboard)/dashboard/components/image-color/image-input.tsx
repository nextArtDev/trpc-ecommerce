'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Image } from '@/lib/generated/prisma'
import React, { useEffect, useState } from 'react'
import { Path, useFormContext } from 'react-hook-form'
import { FileInput, FileUploader } from '../file-input/file-input'
import ImagesPreviewGrid from './images-preview-grid'
import { ExtractedColor } from './color-utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type YourMainFormSchemaType = any // Replace with your actual Zod schema inferred type

const dropZoneConfig = {
  maxFiles: 5,
  maxSize: 1024 * 1024 * 4, // 4MB
  multiple: true,
  accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
}

interface ImageInputProps {
  name: string
  label: string
  initialDataImages?: Partial<Image>[] | null
  createVariantFromColor: (color: ExtractedColor) => void
}

export function ImageInput({
  name,
  label,
  initialDataImages,
  createVariantFromColor,
}: ImageInputProps) {
  const { control, setValue, watch } = useFormContext<YourMainFormSchemaType>()
  const [isEditMode, setIsEditMode] = useState(
    !!initialDataImages && initialDataImages.length > 0
  )
  const fieldValue = watch(name as Path<YourMainFormSchemaType>)

  useEffect(() => {
    if (initialDataImages && initialDataImages.length > 0) {
      const currentValue = fieldValue
      if (
        !currentValue ||
        (Array.isArray(currentValue) && currentValue.length === 0)
      ) {
        setValue(
          name as Path<YourMainFormSchemaType>,
          initialDataImages as unknown
        )
        setIsEditMode(true)
      }
    }
  }, [initialDataImages, name, setValue, fieldValue])

  return (
    <div className="w-full">
      <FormField
        control={control}
        name={name as Path<YourMainFormSchemaType>}
        render={({ field }) => {
          const handleFileChange = (files: File[] | null) => {
            setIsEditMode(false)
            field.onChange(files ?? [])
          }

          const handleRemove = (urlOrFile: string | File) => {
            const currentValue = Array.isArray(field.value) ? field.value : []
            const updatedValue = currentValue.filter((item) => {
              if (typeof urlOrFile === 'string') {
                // It's a URL from an existing image
                return item.url !== urlOrFile
              }
              return item !== urlOrFile // It's a File object from a new upload
            })
            field.onChange(updatedValue)
            if (updatedValue.length === 0) {
              setIsEditMode(false)
            }
          }

          const files = Array.isArray(field.value)
            ? field.value.filter((v) => v instanceof File)
            : []
          const existingImages = Array.isArray(field.value)
            ? field.value.filter((v) => !(v instanceof File) && v.url)
            : []

          const displayGrid = isEditMode ? (
            <ImagesPreviewGrid
              images={existingImages}
              onRemove={(url) => handleRemove(url)}
              createVariantFromColor={createVariantFromColor}
              isEditMode={true}
            />
          ) : (
            <ImagesPreviewGridForFiles
              files={files}
              onRemove={(file) => handleRemove(file)}
              createVariantFromColor={createVariantFromColor}
            />
          )

          return (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={handleFileChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative rounded-lg border border-dashed bg-background p-2"
                >
                  {field.value && field.value.length > 0 ? (
                    displayGrid
                  ) : (
                    <FileInput className="outline-none">
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <FileSvgDraw />
                      </div>
                    </FileInput>
                  )}
                </FileUploader>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </div>
  )
}

// Component to handle file preview URL creation and cleanup
function ImagesPreviewGridForFiles({
  files,
  onRemove,
  createVariantFromColor,
}: {
  files: File[]
  onRemove: (file: File) => void
  createVariantFromColor: (color: ExtractedColor) => void
}) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  useEffect(() => {
    const newUrls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls(newUrls)
    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [files])

  return (
    <ImagesPreviewGrid
      images={files.map((file, index) => ({
        url: previewUrls[index] || '',
        originalFile: file,
      }))}
      onRemove={(url: string) => {
        const index = previewUrls.indexOf(url)
        if (index !== -1) {
          onRemove(files[index])
        }
      }}
      createVariantFromColor={createVariantFromColor}
      isEditMode={false}
    />
  )
}

// SVG component for the upload area
const FileSvgDraw = () => (
  <>
    <svg
      className="mb-4 h-10 w-10 text-gray-500 dark:text-gray-400"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 16"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
      />
    </svg>
    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
      <span className="font-semibold">Click to upload</span> or drag and drop
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400">
      PNG, JPG, GIF, WEBP up to 4MB each
    </p>
  </>
)
