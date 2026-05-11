import type { EditorState } from '@/types'

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawImageFit(ctx: CanvasRenderingContext2D, img: HTMLImageElement | ImageBitmap, dx: number, dy: number, dw: number, dh: number, fit: string) {
  const imgAspect = img.width / img.height
  const canvasAspect = dw / dh

  let sx: number, sy: number, sw: number, sh: number

  if (fit === 'cover') {
    if (imgAspect > canvasAspect) {
      sw = img.height * canvasAspect
      sh = img.height
      sx = (img.width - sw) / 2
      sy = 0
    } else {
      sw = img.width
      sh = img.width / canvasAspect
      sx = 0
      sy = (img.height - sh) / 2
    }
  } else if (fit === 'contain') {
    if (imgAspect > canvasAspect) {
      sw = img.width
      sh = img.width / canvasAspect
      sx = 0
      sy = 0
    } else {
      sw = img.height * canvasAspect
      sh = img.height
      sx = 0
      sy = 0
    }
  } else {
    sx = 0
    sy = 0
    sw = img.width
    sh = img.height
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

async function drawBackground(ctx: CanvasRenderingContext2D, state: EditorState) {
  const { width, height } = ctx.canvas
  const bg = state.background

  switch (bg.type) {
    case 'solid': {
      ctx.fillStyle = bg.color
      ctx.fillRect(0, 0, width, height)
      break
    }
    case 'gradient': {
      const angle = (bg.direction * Math.PI) / 180
      const cx = width / 2
      const cy = height / 2
      const len = Math.sqrt(width * width + height * height) / 2
      const x0 = cx + len * Math.cos(angle + Math.PI)
      const y0 = cy + len * Math.sin(angle + Math.PI)
      const x1 = cx + len * Math.cos(angle)
      const y1 = cy + len * Math.sin(angle)
      const grad = ctx.createLinearGradient(x0, y0, x1, y1)
      grad.addColorStop(0, bg.colors[0])
      grad.addColorStop(1, bg.colors[1])
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)
      break
    }
    case 'image': {
      const img = await loadImage(bg.src)
      drawImageFit(ctx, img, 0, 0, width, height, bg.fit)
      break
    }
    case 'unsplash': {
      const img = await loadImage(bg.urls.regular)
      drawImageFit(ctx, img, 0, 0, width, height, 'cover')
      break
    }
  }
}

export async function renderToCanvas(ctx: CanvasRenderingContext2D, state: EditorState) {
  const { width, height } = ctx.canvas
  ctx.clearRect(0, 0, width, height)

  await drawBackground(ctx, state)

  if (state.sourceImage) {
    const p = state.padding
    const cw = width - p * 2
    const ch = height - p * 2

    const imgAspect = state.sourceImage.width / state.sourceImage.height
    const containerAspect = cw / ch

    let dw: number, dh: number
    if (imgAspect > containerAspect) {
      dw = cw
      dh = cw / imgAspect
    } else {
      dh = ch
      dw = ch * imgAspect
    }

    const dx = (width - dw) / 2
    const dy = (height - dh) / 2

    if (state.shadow.enabled) {
      ctx.save()
      ctx.shadowColor = state.shadow.color
      ctx.shadowBlur = state.shadow.blur
      ctx.shadowOffsetX = state.shadow.offsetX
      ctx.shadowOffsetY = state.shadow.offsetY

      if (state.cornerRadius > 0) {
        roundRect(ctx, dx, dy, dw, dh, state.cornerRadius)
        ctx.fill()
      } else {
        ctx.fillRect(dx, dy, dw, dh)
      }
      ctx.restore()
    }

    if (state.cornerRadius > 0) {
      ctx.save()
      roundRect(ctx, dx, dy, dw, dh, state.cornerRadius)
      ctx.clip()
    }

    const bitmap = await createImageBitmap(state.sourceImage)
    ctx.drawImage(bitmap, dx, dy, dw, dh)
    bitmap.close()

    if (state.cornerRadius > 0) {
      ctx.restore()
    }
  }
}
