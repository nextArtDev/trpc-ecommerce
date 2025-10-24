'use client'

import { FC } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { ExtractedColor } from './color-utils'

interface ColorPaletteProps {
  extractedColors: ExtractedColor[]
  createVariantFromColor: (color: ExtractedColor) => void
}

const ColorPalette: FC<ColorPaletteProps> = ({
  extractedColors,
  createVariantFromColor,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-black/50 rounded-full">
      {extractedColors.map((color) => (
        <Button
          key={color.hex}
          type="button"
          variant="ghost"
          size="icon"
          className="w-6 h-6 rounded-full p-0 m-0 hover:scale-125 transition-transform"
          style={{ backgroundColor: color.hex }}
          title={`Create variant from ${color.name} (${color.hex})`}
          onClick={(e) => {
            e.stopPropagation()
            createVariantFromColor(color)
          }}
        >
          <PlusCircle className="w-4 h-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
        </Button>
      ))}
    </div>
  )
}

export default ColorPalette
