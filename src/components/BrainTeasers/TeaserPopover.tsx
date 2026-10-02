'use client'

import * as Popover from '@radix-ui/react-popover'
import * as Dialog from '@radix-ui/react-dialog'
import type { Teaser } from '../../content/teasers'
import TeaserPanel from './TeaserPanel'
import styles from './TeaserPopover.module.scss'

export const TEASER_PANEL_ID = 'brain-teaser-panel'

// Leader line from the arm's medallion to the popover edge, in screen px.
const LEADER = 36

// Keep clear of the fixed nav (desktop --nav-height is 90px).
const COLLISION_PADDING = { top: 100, right: 16, bottom: 16, left: 16 }

type Props = {
    teaser: Teaser | null
    index: number
    total: number
    label: string
    /** Desktop: where the active arm's medallion sits on the (scaled) stage. */
    anchor: { left: number; top: number; size: number; side: 'left' | 'right' } | null
    mobile: boolean
    onClose: () => void
    onSolved: () => void
}

// The popover never dismisses itself: no outside click, focus-out, scroll-away
// or swipe. Only the X button — and Esc, as its keyboard equivalent — close it.
// Clicking another arm while it's open swaps the teaser instead (the parent
// owns which arm is open).
const stay = (e: Event) => e.preventDefault()

export default function TeaserPopover({ teaser, index, total, label, anchor, mobile, onClose, onSolved }: Props) {
    const open = !!teaser
    const panel = teaser && (
        <TeaserPanel
            teaser={teaser}
            index={index}
            total={total}
            label={label}
            onClose={onClose}
            onSolved={onSolved}
            titleAs={mobile ? Dialog.Title : undefined}
        />
    )

    if (mobile) {
        // Non-modal so the neuron above stays tappable (another arm swaps the
        // teaser) and its firing animation stays visible. No backdrop.
        return (
            <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()} modal={false}>
                <Dialog.Portal>
                    <Dialog.Content
                        id={TEASER_PANEL_ID}
                        className={styles.sheet}
                        aria-describedby={undefined}
                        onInteractOutside={stay}
                        onPointerDownOutside={stay}
                        onFocusOutside={stay}
                        onOpenAutoFocus={stay}
                        onCloseAutoFocus={stay}
                    >
                        {panel}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        )
    }

    return (
        <Popover.Root open={open && !!anchor} onOpenChange={(o) => !o && onClose()}>
            {anchor && (
                <Popover.Anchor
                    className={styles.anchor}
                    style={{ left: anchor.left, top: anchor.top, width: anchor.size, height: anchor.size }}
                />
            )}
            <Popover.Portal>
                <Popover.Content
                    id={TEASER_PANEL_ID}
                    className={styles.popover}
                    side={anchor?.side ?? 'right'}
                    align="center"
                    sideOffset={0}
                    collisionPadding={COLLISION_PADDING}
                    // Track the anchor every frame — the stage pans (a transform) to make room.
                    updatePositionStrategy="always"
                    onInteractOutside={stay}
                    onPointerDownOutside={stay}
                    onFocusOutside={stay}
                    onOpenAutoFocus={stay}
                    onCloseAutoFocus={stay}
                >
                    {panel}
                    <Popover.Arrow asChild width={2} height={LEADER}>
                        <svg className={styles.leader} viewBox={`0 0 2 ${LEADER}`} preserveAspectRatio="none">
                            <line x1="1" y1="0" x2="1" y2={LEADER} />
                            <circle cx="1" cy={LEADER - 1} r="2.5" />
                        </svg>
                    </Popover.Arrow>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
