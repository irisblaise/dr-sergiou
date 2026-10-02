# Brain teasers: art notes

Step 0 of the brain-teasers spec. I studied the existing illustrations in `public/assets/` before drawing anything new. Every new teaser drawing follows these notes.

Sources:
- `skills/neuron-six-arms-transparent-highres.webp`
- `homepage/head-brain-transparent.webp`
- `homepage/pink-layer-0{1..6}-transparent.webp`

## The plate is ink on paper, not ink on black

The spec assumes off-white ink on a black panel. This site is the other way round.

- **The paper.** The page is a warm parchment (`--canvas #efeae1`).
- **The ink.** The illustrations are graphite or dark ink on a transparent background. They sit on the page with `mix-blend-mode: multiply`.
- **The panels.** To look like part of the same plate, the teaser panels use `--canvas` with a hairline `--rule-strong` border. Ink is `--ink`. Square corners, no shadow.
- **Wrong answers.** "Dimmed off-white" becomes dimmed ink (`--muted`, lower opacity). Never red.
- **No-go pulses.** "Off-white" becomes an inked outline on the page's own paper.

**Decision for Iris:** if the teaser panels should still be black, that needs a new token pair in `global.scss`. That conflicts with the spec's own "no new colours" rule.

## Line technique

**Neuron**
- Engraving, close to a 19th-century histology plate.
- Dendrites are tubes drawn as two parallel contour lines, ringed with short cross-segments like bamboo or myelin bands.
- Each tip forks into fine twigs with tick-like barbs.
- The soma is built from dense fine hatching that follows the membrane, plus stippled vacuoles.
- The nucleus is a clean circle with stipple inside.

**Head and brain**
- Graphite pencil, much lighter overall.
- Gyri are drawn as soft contour lines.
- Muscle and skin get fine parallel hatching that follows the form.
- Construction lines run through it: plumb lines, cross-hair ticks, and dotted nerve paths with small node dots.

**Circuit tracks (neuron only)**
- Drawn in sage (`--sage-deep`).
- Double-line traces with via circles and concentric terminal rings.

## Line weights

At the 1000px artwork scale:
- outer contours ≈ 2–2.5px
- interior contours ≈ 1px
- hatching and twigs ≈ 0.4–0.6px, often broken

In the new SVGs these map to the shared weights in `art/Art.module.scss`: `heavy` 1.3, `mid` 0.85, `fine` 0.55, `hatch` 0.4 at 60% opacity, in each SVG's own units.

## Shading

- Shading is never a fill or a gradient.
- It's hatching that follows the form, denser on the shadow side.
- Light areas are left as bare paper.
- Small stipple dots add texture to tissue.

## Anatomical detail

- Believable and specific, but stylised: no labels inside the drawing itself.
- Callouts sit outside, on thin leader lines with a small dot.

## Pink layers

- **Colour.** `--accent` pink.
- **Line.** The layers retrace the drawing's own linework, so gyri outlines come out in brighter pink.
- **Fill.** A pale pink wash under the lines, roughly 30–50% opacity.
- **Edges.** Feathered, so each layer fades out at its boundary instead of ending on a hard edge.
- **Registration.** The layers sit exactly on top of the drawing and read as ink added to the paper.

The teaser overlays (`NeuronFiring.tsx`) follow the same approach: pink retraces the neuron's own tracks.
- a main stroke
- an offset hairline contour with slight irregularity
- hatch ticks along the path
- a wide, low-opacity halo stroke, in place of a blur filter

## Review gate status

These are code-drawn first passes. Each one still needs the side-by-side review against the originals on the preview deployment.

| Piece | File | Self-assessment |
|---|---|---|
| Arm overlays + soma glow | `views/SkillsMain/NeuronFiring.tsx` | Close. They retrace the real tracks. The trunk from each track into the soma is a straight segment, not a traced dendrite. |
| Specimen jar | `art/SpecimenJarArt.tsx` | Reads correctly at header size, but is much simpler than the engraving. |
| Evidence tag + axial slice | `art/EvidenceTagArt.tsx`, `art/AxialSliceArt.tsx` | Fits the plate. Uses a card frame, not anatomy. |
| Hovering hand | `art/HoverHandArt.tsx` | **Flag.** Weakest piece. Hands are hard to draw convincingly as code; likely candidate for an illustrator. |
