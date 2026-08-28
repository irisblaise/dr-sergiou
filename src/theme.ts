// theme.ts — single source of truth for the Dr. Carmen Sergiou design system.
// Mirrors design_handoff README → Design Tokens. Colours are also exposed as CSS
// custom properties in styles/global.scss; the palette switcher swaps the accent ramp.

export const color = {
    canvas: '#efeae1', // page background — warm bone
    ink: '#23211c', // primary text, headings
    body: '#5b574c', // paragraph copy
    muted: '#6c6458', // secondary text, captions
    soft: '#8a8275', // footer meta, faint labels
    navInk: '#3c382f', // nav links (inactive)
    sage: '#7aab96', // anatomical brain green
    sageMid: '#5d8a74',
    sageDeep: '#3f5e50',
} as const

export interface Palette {
    light: string
    mid: string
    label: string // contrast-matched sibling for small pink type — sits between mid and deep
    deep: string
    tint: string
    glow: string // rgb triplet for rgba()
}

// NOTE: `label` for coral/violet/sage is a computed estimate (same lightness/
// saturation/hue offset from `mid` that pink's designer-supplied #A9255D has),
// pending real design review — only the pink ramp is wired into live CSS today.
export const palettes = {
    pink: { light: '#ED4C92', mid: '#C8326F', label: '#A9255D', deep: '#8E214E', tint: '#F8DEEA', glow: '237,76,146' },
    coral: { light: '#FF6A4D', mid: '#E04428', label: '#C52F17', deep: '#9E2C1A', tint: '#FCE0D8', glow: '255,106,77' },
    violet: { light: '#8A6CFF', mid: '#6647D9', label: '#4625CF', deep: '#3F2C93', tint: '#E5DEFA', glow: '138,108,255' },
    sage: { light: '#7aab96', mid: '#5d8a74', label: '#47735D', deep: '#3f5e50', tint: '#DDE8E1', glow: '122,171,150' },
} as const satisfies Record<string, Palette>

export type PaletteKey = keyof typeof palettes
export const defaultPalette: PaletteKey = 'pink'

// Apply a palette's ramp to a DOM element (or :root) as CSS custom properties.
export function applyPalette(el: HTMLElement, key: PaletteKey): void {
    const p = palettes[key]
    el.style.setProperty('--accent', p.light)
    el.style.setProperty('--accent-mid', p.mid)
    el.style.setProperty('--accent-label', p.label)
    el.style.setProperty('--accent-deep', p.deep)
    el.style.setProperty('--accent-tint', p.tint)
    el.style.setProperty('--accent-glow', p.glow)
}

export const font = {
    serif: "'Newsreader', Georgia, serif", // display, H1–H3, logo glyph, pull-quotes
    sans: "'Space Grotesk', system-ui, sans-serif", // body copy
    mono: "'Space Mono', monospace", // eyebrows, nav, section numbers, dates, meta
} as const

export const layout = {
    contentMax: '1160px',
    publicationsMax: '1640px',
    gutter: 'clamp(20px, 4vw, 52px)',
    columnGap: '150px',
    navHeight: '90px',
    navHeightMobile: '60px',
} as const

export const radius = {
    card: '16px',
    spine: '5px 5px 2px 2px',
    detail: '5px',
    pill: '999px',
} as const
