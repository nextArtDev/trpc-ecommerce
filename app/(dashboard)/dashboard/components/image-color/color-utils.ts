import colorNamer from 'color-namer'

// Define the shape of the color object we want
export interface ExtractedColor {
  name: string
  hex: string
}

// Function to convert an RGB array to a hex string
const rgbToHex = (r: number, g: number, b: number): string => {
  r = Math.max(0, Math.min(255, Math.round(r)))
  g = Math.max(0, Math.min(255, Math.round(g)))
  b = Math.max(0, Math.min(255, Math.round(b)))

  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

export const getDominantColors = (
  imageSource: string | File
): Promise<ExtractedColor[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const imageUrl =
      typeof imageSource === 'string'
        ? imageSource
        : URL.createObjectURL(imageSource)

    const cleanup = () => {
      // Clean up the temporary URL if we created one
      if (typeof imageSource !== 'string') {
        URL.revokeObjectURL(imageUrl)
      }
    }

    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('Image load timeout after 10 seconds'))
    }, 10000)
    img.onload = () => {
      clearTimeout(timeout) // Clear the timeout once the image loads
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        canvas.width = img.naturalWidth || img.width
        canvas.height = img.naturalHeight || img.height
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = extractColorsFromImageData(imageData)
        resolve(colors)
      } catch (error) {
        console.error('Error processing image for color extraction:', error)
        reject(error)
      }
    }

    img.onerror = (error) => {
      clearTimeout(timeout)
      console.error('Failed to load image for color extraction:', error)
      reject(new Error('Failed to load image'))
    }

    img.src = imageUrl
  })
}

const extractColorsFromImageData = (imageData: ImageData): ExtractedColor[] => {
  const data = imageData.data
  const colorMap = new Map<string, number>()
  const pixelStep = 40 // Sample every 40th pixel for performance

  for (let i = 0; i < data.length; i += pixelStep) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]

    if (a < 128 || r + g + b < 30 || r + g + b > 720) continue

    const quantizedR = Math.round(r / 32) * 32
    const quantizedG = Math.round(g / 32) * 32
    const quantizedB = Math.round(b / 32) * 32

    const hex = rgbToHex(quantizedR, quantizedG, quantizedB)
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1)
  }

  const mapToExtractedColor = ([hex]: [string, number]): ExtractedColor => {
    // Get the closest human-readable name for the hex code.
    const name = colorNamer(hex).ntc[0].name
    return { name, hex }
  }

  const minOccurrences = Math.max(1, Math.floor(colorMap.size * 0.01))
  const filteredColors = Array.from(colorMap.entries())
    .filter(([, count]) => count >= minOccurrences)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(mapToExtractedColor) // ✨ 4. Use the mapping function here.

  if (filteredColors.length < 3) {
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(mapToExtractedColor) // ✨ 5. And also here.
  }

  return filteredColors.slice(0, 5)
}

export const getGridClassName = (count: number): string => {
  switch (count) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-2'
    case 3:
      return 'grid-cols-3'
    case 4:
      return 'grid-cols-2 grid-rows-2'
    case 5:
      return 'grid-cols-3 grid-rows-2'
    default:
      return 'grid-cols-3'
  }
}

// Extended File interface to include extracted colors
export interface FileWithColors extends File {
  extractedColors?: string[]
  selectedColors?: string[]
}

// Helper to create FileWithColors
export const createFileWithColors = (
  file: File,
  extractedColors: string[] = [],
  selectedColors: string[] = []
): FileWithColors => {
  const fileWithColors = file as FileWithColors
  fileWithColors.extractedColors = extractedColors
  fileWithColors.selectedColors = selectedColors
  return fileWithColors
}

// Utility function to validate if a string is a valid hex color
export const isValidHexColor = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

// Utility function to get contrast color (black or white) for a given background color
export const getContrastColor = (hexColor: string): string => {
  if (!isValidHexColor(hexColor)) return '#000000'

  // Remove # if present
  const hex = hexColor.replace('#', '')

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? '#000000' : '#ffffff'
}
