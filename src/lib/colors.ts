const MAX_DIM = 80
const K = 6
const MAX_ITER = 20

function dist2(a: number[], b: number[]) {
  const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2]
  return dr * dr + dg * dg + db * db
}

function samplePixels(imageData: ImageData): number[][] {
  const { data, width, height } = imageData
  const scale = Math.min(1, MAX_DIM / Math.max(width, height))
  const sw = Math.round(width * scale)
  const sh = Math.round(height * scale)
  const stepX = width / sw
  const stepY = height / sh
  const pixels: number[][] = []

  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const idx = (Math.floor(y * stepY) * width + Math.floor(x * stepX)) * 4
      pixels.push([data[idx], data[idx + 1], data[idx + 2]])
    }
  }
  return pixels
}

function kmeans(pixels: number[][], k: number): number[][] {
  const centroids: number[][] = []

  centroids.push(pixels[Math.floor(Math.random() * pixels.length)])
  for (let i = 1; i < k; i++) {
    const distances = pixels.map(p => {
      const dists = centroids.map(c => dist2(p, c))
      return Math.min(...dists)
    })
    const totalDist = distances.reduce((a, b) => a + b, 0) || 1
    let r = Math.random() * totalDist
    for (let j = 0; j < pixels.length; j++) {
      r -= distances[j]
      if (r <= 0) { centroids.push(pixels[j]); break }
    }
  }

  for (let iter = 0; iter < MAX_ITER; iter++) {
    const assignments: number[][] = Array.from({ length: k }, () => [])
    for (let pi = 0; pi < pixels.length; pi++) {
      const pixel = pixels[pi]
      const dists = centroids.map(c => dist2(pixel, c))
      assignments[dists.indexOf(Math.min(...dists))].push(pi)
    }

    let changed = false
    for (let ci = 0; ci < k; ci++) {
      if (assignments[ci].length === 0) continue
      const sum = assignments[ci].reduce(
        (s, pi) => [s[0] + pixels[pi][0], s[1] + pixels[pi][1], s[2] + pixels[pi][2]],
        [0, 0, 0],
      )
      const avg = sum.map(s => Math.round(s / assignments[ci].length))
      if (centroids[ci][0] !== avg[0] || centroids[ci][1] !== avg[1] || centroids[ci][2] !== avg[2]) {
        centroids[ci] = avg; changed = true
      }
    }
    if (!changed) break
  }

  return centroids
}

function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('')
}

export function extractColors(imageData: ImageData): string[] {
  const pixels = samplePixels(imageData)
  if (pixels.length < K) return pixels.map(p => toHex(p[0], p[1], p[2]))
  const centroids = kmeans(pixels, K)
  return centroids.map(c => toHex(c[0], c[1], c[2]))
}
