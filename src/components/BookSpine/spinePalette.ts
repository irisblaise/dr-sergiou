/** Cyclic cover palette for book spines — repeats by shelf position. */
const SPINE_PALETTE: { bg: string; text: string }[] = [
    { bg: '#E3DACD', text: '#1B1916' },
    { bg: '#698C71', text: '#FFF4E8' },
    { bg: '#975B5E', text: '#FFF4E8' },
    { bg: '#83957C', text: '#FFF4E8' },
    { bg: '#405C48', text: '#FFF4E8' },
    { bg: '#E8E0D3', text: '#1B1916' },
    { bg: '#3F5E49', text: '#FFF4E8' },
    { bg: '#825354', text: '#FFF4E8' },
]

export const getSpineCover = (index: number) => SPINE_PALETTE[index % SPINE_PALETTE.length]
