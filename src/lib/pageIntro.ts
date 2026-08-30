interface PageIntroSource {
    heading?: string
    eyebrow?: string
    intro?: string[]
}

interface PageIntroDefaults {
    heading: string
    eyebrow: string
    intro: string[]
}

// The `pageContent?.field ?? default` fallback shared by every Sanity-backed
// page intro (Impact, Projects, Publications, Skills, Contact) — one home
// instead of five copies of the same three lines.
export function resolvePageIntro(pageContent: PageIntroSource | null | undefined, defaults: PageIntroDefaults) {
    return {
        heading: pageContent?.heading ?? defaults.heading,
        eyebrow: pageContent?.eyebrow ?? defaults.eyebrow,
        paragraphs: pageContent?.intro?.length ? pageContent.intro : defaults.intro,
    }
}
