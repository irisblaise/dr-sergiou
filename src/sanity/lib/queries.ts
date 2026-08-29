import { groq } from 'next-sanity'
import { client } from './client'
import type { Award, MediaItem, Project, Publication, Skill } from '../../data/types'

// Each query resolves image references to plain CDN url strings (and gallery
// assets to the flat { type, src } shape) so the existing components — which
// expect `image: string` etc. — keep working unchanged. `imageAlt` is exposed
// alongside as a sibling field rather than nesting `image` into an object, to
// avoid touching every component's prop shape.

const seoProjection = groq`{
  metaTitle,
  metaDescription,
  "ogImage": ogImage.asset->url,
  "ogImageAlt": ogImage.alt,
  noIndex
}`

export interface SiteSettings {
    siteName?: string
    siteUrl?: string
    defaultSeo?: {
        metaTitle?: string
        metaDescription?: string
        ogImage?: string
        ogImageAlt?: string
        noIndex?: boolean
    }
    socialLinks?: string[]
}

const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  siteName,
  siteUrl,
  "defaultSeo": defaultSeo${seoProjection},
  socialLinks
}`

const skillsQuery = groq`*[_type == "skill"] | order(order asc){
  "key": key,
  label,
  detail,
  "image": image.asset->url,
  "imageAlt": image.alt
}`

const projectsQuery = groq`*[_type == "project"] | order(node asc){
  title,
  description,
  link,
  dateRange,
  year,
  color,
  node,
  "image": image.asset->url,
  "imageAlt": image.alt
}`

const publicationsQuery = groq`*[_type == "publication"] | order(year desc){
  title,
  authors,
  journal,
  year,
  kind,
  topics,
  authorship,
  abstract,
  link,
  "pdf": pdf.asset->url,
  accolade
}`

const galleryProjection = `"assets": assets[]{
    "type": type,
    "src": select(type == "video" => videoUrl, image.asset->url),
    "alt": image.alt
  }`

const awardsQuery = groq`*[_type == "award"] | order(order asc){
  mediaType,
  subject,
  peopleInvolved,
  description,
  date,
  "image": image.asset->url,
  "imageAlt": image.alt,
  ${galleryProjection}
}`

const mediaQuery = groq`*[_type == "mediaItem"] | order(order asc){
  mediaType,
  subject,
  peopleInvolved,
  description,
  link,
  date,
  "image": image.asset->url,
  "imageAlt": image.alt,
  ${galleryProjection}
}`

export interface HomeContent {
    heroHeadline: string
    heroIntro: string[]
    passions: { number?: string; title: string; description: string }[]
    fullBio?: string
    seo?: {
        metaTitle?: string
        metaDescription?: string
        ogImage?: string
        ogImageAlt?: string
        noIndex?: boolean
    }
}

export interface PageContent {
    page: string
    heading?: string
    eyebrow?: string
    intro?: string[]
    body?: string
    contactDetails?: {
        label?: string
        value?: string
        href?: string
        note?: string
    }[]
    position?: string
    institution?: string
    socialLinks?: {
        label?: string
        href?: string
    }[]
}

const homeQuery = groq`*[_type == "homePage"][0]{
  heroHeadline,
  heroIntro,
  passions[]{ number, title, description },
  fullBio,
  "seo": seo${seoProjection}
}`

const pageContentQuery = groq`*[_type == "pageContent" && page == $page][0]{
  page,
  heading,
  eyebrow,
  intro,
  body,
  contactDetails[]{ label, value, href, note },
  position,
  institution,
  socialLinks[]{ label, href }
}`

// ISR: cache the fetch and revalidate on an interval so edits in the Studio
// appear without a redeploy.
const REVALIDATE = 60

export const getSiteSettings = () =>
    client.fetch<SiteSettings | null>(siteSettingsQuery, {}, { next: { revalidate: REVALIDATE } })

export const getHome = () =>
    client.fetch<HomeContent | null>(homeQuery, {}, { next: { revalidate: REVALIDATE } })

export const getPageContent = (page: string) =>
    client.fetch<PageContent | null>(pageContentQuery, { page }, { next: { revalidate: REVALIDATE } })

export const getSkills = () =>
    client.fetch<Skill[]>(skillsQuery, {}, { next: { revalidate: REVALIDATE } })

export const getProjects = () =>
    client.fetch<Project[]>(projectsQuery, {}, { next: { revalidate: REVALIDATE } })

export const getPublications = () =>
    client.fetch<Publication[]>(publicationsQuery, {}, { next: { revalidate: REVALIDATE } })

export const getAwards = () =>
    client.fetch<Award[]>(awardsQuery, {}, { next: { revalidate: REVALIDATE } })

export const getMedia = () =>
    client.fetch<MediaItem[]>(mediaQuery, {}, { next: { revalidate: REVALIDATE } })
