import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    api: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    },
    // Hosted Studio URL: https://carmen-sergiou.sanity.studio
    studioHost: 'carmen-sergiou',
})
