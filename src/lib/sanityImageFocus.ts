import type { CSSProperties } from 'react'

// Sanity stores an image's editor-chosen crop and hotspot as fractions of the
// *original* image. These helpers translate them for an `object-fit: cover`
// <Image>: the crop becomes a CDN `rect` param, the hotspot an object-position.

export interface SanityCrop {
    top: number
    bottom: number
    left: number
    right: number
}
export interface SanityHotspot {
    x: number
    y: number
}
export interface SanityDimensions {
    width: number
    height: number
}
export interface SanityImageFocus {
    crop?: SanityCrop | null
    hotspot?: SanityHotspot | null
    dimensions?: SanityDimensions | null
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** Apply the Studio crop to a Sanity CDN url via the `rect` param. */
export function croppedSanityUrl(src: string, focus?: SanityImageFocus): string {
    const { crop, dimensions } = focus ?? {}
    if (!crop || !dimensions || !src.startsWith('https://cdn.sanity.io/images/')) return src
    const { width, height } = dimensions
    const left = Math.round(crop.left * width)
    const top = Math.round(crop.top * height)
    const w = Math.round((1 - crop.left - crop.right) * width)
    const h = Math.round((1 - crop.top - crop.bottom) * height)
    if (w <= 0 || h <= 0 || (left === 0 && top === 0 && w === width && h === height)) return src
    const url = new URL(src)
    url.searchParams.set('rect', `${left},${top},${w},${h}`)
    return url.toString()
}

/** object-position that keeps the Studio hotspot in view, relative to the cropped image. */
export function hotspotObjectPosition(focus?: SanityImageFocus): CSSProperties['objectPosition'] {
    const { hotspot, crop } = focus ?? {}
    if (!hotspot) return undefined
    const c = crop ?? { top: 0, bottom: 0, left: 0, right: 0 }
    const cw = 1 - c.left - c.right
    const ch = 1 - c.top - c.bottom
    const x = cw > 0 ? clamp01((hotspot.x - c.left) / cw) : 0.5
    const y = ch > 0 ? clamp01((hotspot.y - c.top) / ch) : 0.5
    return `${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`
}
