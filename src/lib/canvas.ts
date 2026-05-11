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

  const bezelSide = Math.max(18, Math.round(dw * 0.045))
  const bezelTop = Math.max(16, Math.round(dh * 0.06))
  const bezelBottom = Math.max(20, Math.round(dh * 0.065))
  const bodyW = dw + bezelSide * 2
  const bodyH = dh + bezelTop + bezelBottom
  const bodyX = dx - bezelSide
  const bodyY = dy - bezelTop
  const bodyRadius = 14

  const bitmap = await createImageBitmap(img)
  ctx.drawImage(bitmap, dx, dy, dw, dh)
  bitmap.close()

  if (state.shadow.enabled) {
    ctx.save()
    ctx.shadowColor = state.shadow.color
    ctx.shadowBlur = state.shadow.blur
    ctx.shadowOffsetX = state.shadow.offsetX
    ctx.shadowOffsetY = state.shadow.offsetY
    ctx.fillStyle = '#6e6e73'
    roundRect(ctx, bodyX, bodyY, bodyW, bodyH, bodyRadius)
    ctx.fill()
    ctx.restore()
  }

  ctx.fillStyle = '#6e6e73'
  roundRect(ctx, bodyX, bodyY, bodyW, bodyH, bodyRadius)
  ctx.fill()

  const grad = ctx.createLinearGradient(bodyX, bodyY, bodyX, bodyY + bodyH)
  grad.addColorStop(0, '#7a7a80')
  grad.addColorStop(0.5, '#6e6e73')
  grad.addColorStop(1, '#58585e')
  ctx.fillStyle = grad
  roundRect(ctx, bodyX, bodyY, bodyW, bodyH, bodyRadius)
  ctx.fill()

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = '#000000'
  roundRect(ctx, dx, dy, dw, dh, 2)
  ctx.fill()
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

  const bezelSide = Math.max(14, Math.round(dw * 0.025))
  const bezelTop = Math.max(12, Math.round(dh * 0.025))
  const chinH = Math.max(45, Math.round(dh * 0.12))
  const monitorW = dw + bezelSide * 2
  const monitorH = dh + bezelTop + chinH
  const monitorX = dx - bezelSide
  const monitorY = dy - bezelTop
  const monitorRadius = 10

  const standNeckH = Math.round(dh * 0.18)
  const standNeckTopW = Math.round(monitorW * 0.2)
  const standNeckBotW = Math.round(monitorW * 0.45)
  const baseH = 6
  const baseW = Math.round(monitorW * 0.55)
  const standTopX = monitorX + (monitorW - standNeckTopW) / 2
  const standBotX = monitorX + (monitorW - standNeckBotW) / 2
  const baseX = monitorX + (monitorW - baseW) / 2
  const standTopY = monitorY + monitorH
  const standBotY = standTopY + standNeckH
  const baseY = standBotY

  const bitmap = await createImageBitmap(img)
  ctx.drawImage(bitmap, dx, dy, dw, dh)
  bitmap.close()

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

  const grad = ctx.createLinearGradient(monitorX, monitorY, monitorX, monitorY + monitorH)
  grad.addColorStop(0, '#d0d0d0')
  grad.addColorStop(0.6, '#c0c0c0')
  grad.addColorStop(1, '#a8a8a8')
  ctx.fillStyle = grad
  roundRect(ctx, monitorX, monitorY, monitorW, monitorH, monitorRadius)
  ctx.fill()

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
  roundRect(ctx, baseX, baseY, baseW, baseH, 3)
  ctx.fill()

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = '#000000'
  roundRect(ctx, dx, dy, dw, dh, 2)
  ctx.fill()
  ctx.restore()
}
