import NextImage from 'next/image'
import { Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import ColorPalette from './color-palette'
import {
  ExtractedColor,
  getDominantColors,
  getGridClassName,
} from './color-utils'
import { FC, useEffect, useState } from 'react'

interface ImageData {
  id?: string
  url: string
  key?: string
  originalFile?: File
}

interface ImagesPreviewGridProps {
  images: ImageData[]
  onRemove: (url: string) => void
  createVariantFromColor: (color: ExtractedColor) => void
  isEditMode?: boolean
}

const ImagesPreviewGrid: FC<ImagesPreviewGridProps> = ({
  images,
  onRemove,
  createVariantFromColor,
}) => {
  const imagesLength = images.length
  const GridClassName = getGridClassName(imagesLength)
  const [colorPalettes, setColorPalettes] = useState<ExtractedColor[][]>([])
  const [loadingColors, setLoadingColors] = useState<boolean[]>([])

  useEffect(() => {
    const fetchColors = async () => {
      setLoadingColors(new Array(imagesLength).fill(true))
      const palettes = await Promise.all(
        images.map(async (img) => {
          const imageSource = img.originalFile || img.url
          if (imageSource) {
            try {
              // Pass the source directly
              return await getDominantColors(imageSource)
            } catch (error) {
              console.error(`Error fetching colors for image:`, error)
              return []
            }
          }
          return []
        })
      )
      setColorPalettes(palettes)
      setLoadingColors(new Array(imagesLength).fill(false))
    }

    if (images.length > 0) {
      fetchColors()
    } else {
      setColorPalettes([])
    }
  }, [images, imagesLength])

  if (imagesLength === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'grid bg-white rounded-md overflow-hidden max-h-[600px] gap-2 p-2',
        GridClassName
      )}
    >
      {images.map((img, i) => (
        <div
          key={img.url || `image-${i}`}
          className="relative group h-full w-full border rounded-lg overflow-hidden"
          style={{ aspectRatio: '1 / 1' }}
        >
          <NextImage
            src={img.url}
            alt={`Preview ${i + 1}`}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-between p-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full flex justify-center mt-2">
              {loadingColors[i] ? (
                <div className="text-white text-xs">Loading colors...</div>
              ) : (
                colorPalettes[i] &&
                colorPalettes[i].length > 0 && (
                  <ColorPalette
                    extractedColors={colorPalettes[i]}
                    createVariantFromColor={createVariantFromColor}
                  />
                )
              )}
            </div>
            <div className="w-full flex justify-end">
              <button
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(img.url)
                }}
                title="Remove image"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ImagesPreviewGrid
