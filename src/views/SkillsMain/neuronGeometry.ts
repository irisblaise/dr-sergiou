import type { SkillKey } from '../../data/types'

// Shared geometry for the skills neuron — the desktop stage (SkillsPage), the
// mobile figure, and the brain-teaser firing overlays (NeuronFiring) all
// draw on top of the same artwork, so the traced arm paths live here once.

// Design-space stage — matches Skills · Map the Network.dc.html (design handoff).
export const STAGE_W = 1600
export const STAGE_H = 1040

// Placement of the artwork's own 1000×1000 space within the stage. The traced
// arm paths below are authored in that 1000×1000 space, so this transform is
// what makes them land exactly on top of the artwork's own tracks.
export const OX = 525
export const OY = 165
export const SC = 0.75

// Centre of the cell body (nucleus) in the artwork's 1000×1000 space — where
// a solved branch's pulse ends up, and where the "all six" glow sits.
export const SOMA: Pt = [480, 452]

export type ArmDef = {
    key: SkillKey
    captionSide: 'l' | 'r' | 'c'
    vias: number[]
    d: string
}

// Traced pixel-by-pixel from neuron-six-arms-transparent-highres.webp (1000×1000
// artwork space), soma-first so the live track always grows outward from the
// cell body. Re-trace from the artwork if it's ever replaced — see arms.json
// in the design handoff.
export const ARMS: ArmDef[] = [
    {
        key: 'neuro',
        captionSide: 'c',
        vias: [0.3, 0.56, 0.8],
        d: 'M343.7 333.3 L339.3 297 L318.2 281.9 L314.2 272.3 L289.1 252.8 L272.3 250.8 L264.8 242.4 L250.4 238.4 L221.7 236.8 L204.9 222.5 L194.2 203.7 L176.2 196.2 L108.5 196.6',
    },
    {
        key: 'coding',
        captionSide: 'r',
        vias: [0.3, 0.56, 0.8],
        d: 'M653.5 333.7 L661.9 296.7 L715.7 254 L734.1 252.4 L749.6 246 L778.3 244.4 L795.1 229.3 L807.4 205.3 L820.6 199 L875.6 196.6 L899.9 193.4',
    },
    {
        key: 'vr',
        captionSide: 'r',
        vias: [0.3, 0.8],
        d: 'M795.1 480.5 L801.8 476.5 L812.6 484.4 L858.1 482.1 L876 469.3 L897.5 469.3 L911.9 476.5 L959.5 476.6',
    },
    {
        key: 'music',
        captionSide: 'r',
        vias: [0.3, 0.56, 0.8],
        d: 'M773.5 662.7 L777.9 707.7 L796.3 731.3 L818.2 744.4 L826.6 756.4 L848.5 758.8 L870 775.1 L876.4 790.7 L877.6 823.4 L888 840.1 L895.9 863.6',
    },
    {
        key: 'behavior',
        captionSide: 'l',
        vias: [0.3, 0.56, 0.8],
        d: 'M240.4 670.3 L240.4 686.2 L234.4 703.3 L218.5 725.7 L171.9 756.4 L151.9 757.6 L127.6 773.9 L118 793.5 L116.8 824.6 L102.5 863.2',
    },
    {
        key: 'forensic',
        captionSide: 'l',
        vias: [0.3, 0.56, 0.8],
        d: 'M195.4 464.1 L186.6 460.5 L172.2 474.9 L146.3 476.5 L138.4 471.7 L124 471.3 L118.4 477.7 L44.7 474.5',
    },
]

export type Pt = [number, number]

export function parsePolyline(d: string): Pt[] {
    return d
        .split(/[ML]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.split(/\s+/).map(Number) as Pt)
}

export function polylineLength(pts: Pt[]): number {
    let len = 0
    for (let i = 1; i < pts.length; i++) {
        len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    }
    return len
}

// SVG geometry only needs sub-pixel precision, and rounding here makes the
// server- and client-rendered markup byte-identical — Math.hypot's last bit
// isn't guaranteed to match across JS engines, so an unrounded value can
// differ between SSR and the browser and trip a hydration mismatch.
export function round(n: number): number {
    return Math.round(n * 10000) / 10000
}

// Reproduces SVGPathElement.getPointAtLength for a plain polyline, without
// needing a real DOM node — the traced arms are all M/L segments, so this is
// exact, not an approximation.
export function pointAtFraction(pts: Pt[], f: number): Pt {
    const target = polylineLength(pts) * f
    let acc = 0
    for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1]
        const [x1, y1] = pts[i]
        const segLen = Math.hypot(x1 - x0, y1 - y0)
        if (acc + segLen >= target) {
            const t = segLen === 0 ? 0 : (target - acc) / segLen
            return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]
        }
        acc += segLen
    }
    return pts[pts.length - 1]
}

export function toPathD(pts: Pt[]): string {
    return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${round(x)} ${round(y)}`).join(' ')
}

export type ArmLayout = ArmDef & {
    viaPoints: Pt[]
    end: Pt
    length: number
    medallion: { left: number; top: number }
    caption: { left: number; top: number; align: 'left' | 'right' }
    /** Which side of the cell body the arm sits on — teaser popovers open
     *  on that side, facing away from the soma, so the branch stays visible. */
    side: 'left' | 'right'
}

// Node image slot (medallion) sits 50px along the arm's outgoing direction
// from its terminal node; the caption anchor is 76px along the same line —
// both in stage px, so the terminal node always sits on the medallion's rim.
function layoutArm(arm: ArmDef): ArmLayout {
    const pts = parsePolyline(arm.d)
    const end = pts[pts.length - 1]
    const prev = pts[pts.length - 2]
    const dx = end[0] - prev[0]
    const dy = end[1] - prev[1]
    const dl = Math.hypot(dx, dy) || 1
    const ux = dx / dl
    const uy = dy / dl
    const ex = OX + end[0] * SC
    const ey = OY + end[1] * SC
    const cx0 = ex + ux * 76
    const cy0 = ey + uy * 76

    const caption: ArmLayout['caption'] =
        arm.captionSide === 'r'
            ? { left: round(cx0 + 76), top: round(cy0 - 40), align: 'left' }
            : arm.captionSide === 'l'
              ? { left: round(cx0 - 76 - 200), top: round(cy0 - 40), align: 'right' }
              : { left: round(ex + 28), top: round(ey - 92), align: 'left' }

    return {
        ...arm,
        viaPoints: arm.vias.map((f) => pointAtFraction(pts, f).map(round) as Pt),
        end: [round(end[0]), round(end[1])],
        length: round(polylineLength(pts)),
        medallion: { left: round(ex + ux * 50), top: round(ey + uy * 50) },
        caption,
        side: end[0] < SOMA[0] ? 'left' : 'right',
    }
}

export const ARM_LAYOUT: ArmLayout[] = ARMS.map(layoutArm)
