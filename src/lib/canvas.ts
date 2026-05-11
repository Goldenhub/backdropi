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

async function drawBackground(ctx: CanvasRenderingContext2D, state: EditorState, width: number, height: number) {
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
  const { width, height } = state.canvasSize ?? ctx.canvas
  ctx.clearRect(0, 0, width, height)

  await drawBackground(ctx, state, width, height)

  if (state.sourceImage) {
    const p = state.padding

    if (state.mockupType === 'browser') {
      await drawBrowserMockup(ctx, state, width, height, p)
    } else if (state.mockupType === 'laptop') {
      await drawLaptopMockup(ctx, state, width, height, p)
    } else if (state.mockupType === 'desktop') {
      await drawDesktopMockup(ctx, state, width, height, p)
    } else {
      await drawScreenshotMockup(ctx, state, width, height, p)
    }
  }
}

async function drawScreenshotMockup(ctx: CanvasRenderingContext2D, state: EditorState, width: number, height: number, p: number) {
  const cw = width - p * 2
  const ch = height - p * 2

  const imgAspect = state.sourceImage!.width / state.sourceImage!.height
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

  const bitmap = await createImageBitmap(state.sourceImage!)
  ctx.drawImage(bitmap, dx, dy, dw, dh)
  bitmap.close()

  if (state.cornerRadius > 0) {
    ctx.restore()
  }
}

async function drawBrowserMockup(ctx: CanvasRenderingContext2D, state: EditorState, width: number, height: number, p: number) {
  const chromeH = 48
  const brX = p
  const brY = p
  const brW = width - p * 2
  const brH = height - p * 2
  const winRadius = 12

  const contentX = brX
  const contentY = brY + chromeH
  const contentW = brW
  const contentH = brH - chromeH

  const img = state.sourceImage!
  const imgAspect = img.width / img.height
  const containerAspect = contentW / contentH

  let dw: number, dh: number
  if (imgAspect > containerAspect) {
    dw = contentW
    dh = contentW / imgAspect
  } else {
    dh = contentH
    dw = contentH * imgAspect
  }

  const dx = contentX + (contentW - dw) / 2
  const dy = contentY + (contentH - dh) / 2

  if (state.shadow.enabled) {
    ctx.save()
    ctx.shadowColor = state.shadow.color
    ctx.shadowBlur = state.shadow.blur
    ctx.shadowOffsetX = state.shadow.offsetX
    ctx.shadowOffsetY = state.shadow.offsetY
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, brX, brY, brW, brH, winRadius)
    ctx.fill()
    ctx.restore()
  } else {
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, brX, brY, brW, brH, winRadius)
    ctx.fill()
  }

  ctx.save()
  roundRect(ctx, brX, brY, brW, brH, winRadius)
  ctx.clip()

  ctx.fillStyle = '#f4f4f5'
  ctx.fillRect(brX, brY, brW, chromeH)

  const separatorY = brY + chromeH
  ctx.strokeStyle = '#e4e4e7'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(brX, separatorY)
  ctx.lineTo(brX + brW, separatorY)
  ctx.stroke()

  const dotR = 8
  const dotY = brY + chromeH / 2
  const dotColors = ['#ff5f5f', '#ffbd2e', '#28c840']
  const dotStart = brX + 20

  dotColors.forEach((color, i) => {
    ctx.beginPath()
    ctx.arc(dotStart + i * 24, dotY, dotR, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })

  const urlW = Math.min(360, Math.round(brW * 0.5))
  const urlH = 30
  const urlX = brX + (brW - urlW) / 2
  const urlY = brY + (chromeH - urlH) / 2

  ctx.fillStyle = '#ffffff'
  roundRect(ctx, urlX, urlY, urlW, urlH, 9)
  ctx.fill()

  ctx.strokeStyle = '#d4d4d8'
  ctx.lineWidth = 1
  roundRect(ctx, urlX, urlY, urlW, urlH, 9)
  ctx.stroke()

  ctx.font = '13px system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'

  const lockX = urlX + 10
  ctx.fillStyle = '#a1a1aa'
  ctx.font = '14px system-ui, -apple-system, sans-serif'
  ctx.fillText('🔒', lockX, urlY + urlH / 2)

  ctx.fillStyle = '#71717a'
  ctx.font = '13px system-ui, -apple-system, sans-serif'
  ctx.fillText('backdropi.app', lockX + 22, urlY + urlH / 2)

  ctx.restore()

  ctx.strokeStyle = '#d4d4d8'
  ctx.lineWidth = 1
  roundRect(ctx, brX, brY, brW, brH, winRadius)
  ctx.stroke()

  if (state.cornerRadius > 0 && state.mockupType !== 'browser') {
    ctx.save()
    roundRect(ctx, dx, dy, dw, dh, state.cornerRadius)
    ctx.clip()
  }

  const bitmap = await createImageBitmap(img)
  ctx.drawImage(bitmap, dx, dy, dw, dh)
  bitmap.close()

  if (state.cornerRadius > 0 && state.mockupType !== 'browser') {
    ctx.restore()
  }
}

async function drawLaptopMockup(ctx: CanvasRenderingContext2D, state: EditorState, width: number, height: number, p: number) {
  const cw = width - p * 2
  const ch = height - p * 2

  const img = state.sourceImage!
  const imgAspect = img.width / img.height
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

  const bezelSide = Math.max(16, Math.round(dw * 0.03))
  const bezelTop = Math.max(12, Math.round(dh * 0.025))
  const bezelBottom = Math.max(18, Math.round(dh * 0.04))
  const keyboardH = Math.max(140, Math.round(dh * 0.32))
  const lidH = dh + bezelTop + bezelBottom
  const deviceH = lidH + keyboardH
  const deviceW = dw + bezelSide * 2
  const deviceX = dx - bezelSide
  const deviceY = dy - bezelTop
  const lidRadius = 12
  const screenRadius = 4

  if (state.shadow.enabled) {
    ctx.save()
    ctx.shadowColor = state.shadow.color
    ctx.shadowBlur = state.shadow.blur
    ctx.shadowOffsetX = state.shadow.offsetX
    ctx.shadowOffsetY = state.shadow.offsetY
    ctx.fillStyle = '#b0b0b0'
    const bodyRadius = 10
    roundRect(ctx, deviceX, deviceY, deviceW, deviceH, bodyRadius)
    ctx.fill()
    ctx.restore()
  }

  ctx.fillStyle = '#b0b0b0'
  roundRect(ctx, deviceX, deviceY, deviceW, lidH, lidRadius)
  ctx.fill()

  ctx.strokeStyle = '#8a8a8a'
  ctx.lineWidth = 1
  roundRect(ctx, deviceX, deviceY, deviceW, lidH, lidRadius)
  ctx.stroke()

  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(dx, dy, dw, dh)

  const baseY = deviceY + lidH
  const baseGrad = ctx.createLinearGradient(0, baseY, 0, deviceY + deviceH)
  baseGrad.addColorStop(0, '#8a8a8a')
  baseGrad.addColorStop(0.3, '#6b6b6b')
  baseGrad.addColorStop(1, '#4a4a4a')
  ctx.fillStyle = baseGrad
  roundRect(ctx, deviceX, baseY, deviceW, keyboardH, 10)
  ctx.fill()

  ctx.strokeStyle = '#6b6b6b'
  ctx.lineWidth = 1
  roundRect(ctx, deviceX, baseY, deviceW, keyboardH, 10)
  ctx.stroke()

  ctx.strokeStyle = '#6b6b6b'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(deviceX, baseY - 0.5)
  ctx.lineTo(deviceX + deviceW, baseY - 0.5)
  ctx.stroke()

  const trackpadW = Math.round(deviceW * 0.35)
  const trackpadH = Math.round(keyboardH * 0.2)
  const trackpadX = deviceX + deviceW - trackpadW - Math.round(deviceW * 0.08)
  const trackpadY = baseY + keyboardH - trackpadH - Math.round(keyboardH * 0.08)
  ctx.fillStyle = '#5a5a5a'
  roundRect(ctx, trackpadX, trackpadY, trackpadW, trackpadH, 4)
  ctx.fill()

  ctx.save()
  roundRect(ctx, dx, dy, dw, dh, screenRadius)
  ctx.clip()

  const bitmap = await createImageBitmap(img)
  ctx.drawImage(bitmap, dx, dy, dw, dh)
  bitmap.close()

  ctx.restore()
}

async function drawDesktopMockup(ctx: CanvasRenderingContext2D, state: EditorState, width: number, height: number, p: number) {
  const cw = width - p * 2
  const ch = height - p * 2

  const img = state.sourceImage!
  const imgAspect = img.width / img.height
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

  const bezelSide = Math.max(18, Math.round(dw * 0.03))
  const bezelTop = Math.max(14, Math.round(dh * 0.025))
  const chinH = Math.max(40, Math.round(dh * 0.08))
  const standNeckH = Math.max(100, Math.round(dh * 0.25))
  const baseH = 6
  const monitorH = dh + bezelTop + chinH
  const monitorW = dw + bezelSide * 2
  const monitorX = dx - bezelSide
  const monitorY = dy - bezelTop
  const monitorRadius = 12

  const standNeckTopW = Math.round(monitorW * 0.2)
  const standNeckBotW = Math.round(monitorW * 0.45)
  const baseW = Math.round(monitorW * 0.55)
  const standTopX = monitorX + (monitorW - standNeckTopW) / 2
  const standBotX = monitorX + (monitorW - standNeckBotW) / 2
  const baseX = monitorX + (monitorW - baseW) / 2
  const standTopY = monitorY + monitorH
  const standBotY = standTopY + standNeckH
  const baseY = standBotY

  if (state.shadow.enabled) {
    ctx.save()
    ctx.shadowColor = state.shadow.color
    ctx.shadowBlur = state.shadow.blur
    ctx.shadowOffsetX = state.shadow.offsetX
    ctx.shadowOffsetY = state.shadow.offsetY
    ctx.fillStyle = '#c0c0c0'
    roundRect(ctx, monitorX, monitorY, monitorW, monitorH, monitorRadius)
    ctx.fill()
    ctx.restore()
  }

  ctx.fillStyle = '#c0c0c0'
  roundRect(ctx, monitorX, monitorY, monitorW, monitorH, monitorRadius)
  ctx.fill()

  ctx.strokeStyle = '#a0a0a0'
  ctx.lineWidth = 1
  roundRect(ctx, monitorX, monitorY, monitorW, monitorH, monitorRadius)
  ctx.stroke()

  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(dx, dy, dw, dh)

  const neckGrad = ctx.createLinearGradient(0, standTopY, 0, standBotY)
  neckGrad.addColorStop(0, '#a0a0a0')
  neckGrad.addColorStop(1, '#808080')
  ctx.fillStyle = neckGrad
  ctx.beginPath()
  ctx.moveTo(standTopX, standTopY)
  ctx.lineTo(standTopX + standNeckTopW, standTopY)
  ctx.lineTo(standBotX + standNeckBotW, standBotY)
  ctx.lineTo(standBotX, standBotY)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#707070'
  ctx.fillRect(baseX, baseY, baseW, baseH)

  ctx.save()
  const screenRadius = 4
  roundRect(ctx, dx, dy, dw, dh, screenRadius)
  ctx.clip()

  const bitmap = await createImageBitmap(img)
  ctx.drawImage(bitmap, dx, dy, dw, dh)
  bitmap.close()

  ctx.restore()
}
