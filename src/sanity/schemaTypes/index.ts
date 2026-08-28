import type { SchemaTypeDefinition } from 'sanity'
import { seo } from './seo'
import { siteSettings } from './siteSettings'
import { homePage } from './homePage'
import { skill } from './skill'
import { project } from './project'
import { publication } from './publication'
import { impactAsset } from './impactAsset'
import { award } from './award'
import { mediaItem } from './mediaItem'

export const schemaTypes: SchemaTypeDefinition[] = [
    seo,
    siteSettings,
    homePage,
    skill,
    project,
    publication,
    award,
    mediaItem,
    impactAsset,
]
