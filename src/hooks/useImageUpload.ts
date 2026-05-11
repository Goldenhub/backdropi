import { useCallback } from 'react'
import { useEditor } from '@/context/EditorContext'
import { IMAGE_MIME_TYPES, UPLOAD_MAX_SIZE } from '@/lib/constants'

export function useImageUpload() {
  const { dispatch } = useEditor()

  const loadImage = useCallback((file: File) => {
    if (!IMAGE_MIME_TYPES.includes(file.type)) {
      console.warn('Unsupported image type:', file.type)
      return
    }
    if (file.size > UPLOAD_MAX_SIZE) {
      console.warn('Image too large, max 20MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        dispatch({ type: 'SET_SOURCE_IMAGE', payload: { imageData, src, width: canvas.width, height: canvas.height } })
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }, [dispatch])

  return { loadImage }
}
