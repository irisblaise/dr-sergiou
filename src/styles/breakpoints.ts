// TS mirror of _breakpoints.scss's $bp-standard — the dominant mobile/desktop
// split. Sass and TS can't share one literal source without extra build
// tooling, so this number is kept in sync with $bp-standard by convention.
export const BP_STANDARD = 900

export const MOBILE_QUERY = `(max-width: ${BP_STANDARD}px)`
export const DESKTOP_QUERY = `(min-width: ${BP_STANDARD + 1}px)`

// TS mirror of _breakpoints.scss's $bp-card — Contact's card-layout switch.
export const BP_CARD = 1024

export const CARD_QUERY = `(max-width: ${BP_CARD}px)`
