import '@testing-library/jest-dom'

if (!globalThis.ImageData) {
  class ImageDataPolyfill {
    width: number
    height: number
    data: Uint8ClampedArray
    constructor(width: number, height: number) {
      this.width = width
      this.height = height
      this.data = new Uint8ClampedArray(width * height * 4)
    }
  }
  globalThis.ImageData = ImageDataPolyfill as unknown as typeof ImageData
}

if (!globalThis.createImageBitmap) {
  globalThis.createImageBitmap = (async (image: ImageData) => ({
    width: image.width,
    height: image.height,
    close: () => {},
  })) as any
}
