import { groq } from 'next-sanity'
import { client } from './client'
import type { Award, MediaItem, Project, Publication, Skill } from '../../data/types'

// Each query resolves image references to plain CDN url strings (and gallery
// assets to the flat { type, src } shape) so the existing components — which
// expect `image: string` etc. — keep working unchanged.

const skillsQuery = groq`*[_type == "skill"] | order(order asc){
  "key": key,
  label,
  detail,
  "image": image.asset->url
}`

const projectsQuery = groq`*[_type == "project"] | order(node asc){
  title,
  description,
  link,
  dateRange,
  year,
  color,
  node,
  "image": image.asset->url
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
  cover,
  accolade
}`

const galleryProjection = `"assets": assets[]{
    "type": type,
    "src": select(type == "video" => videoUrl, image.asset->url)
  }`

const awardsQuery = groq`*[_type == "award"] | order(order asc){
  mediaType,
  subject,
  peopleInvolved,
  description,
  date,
  "image": image.asset->url,
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
  ${galleryProjection}
}`

export interface HomeContent {
    heroHeadline: string
    heroIntro: string[]
    passions: { number?: string; title: string; description: string }[]
    fullBio?: string
}

const homeQuery = groq`*[_type == "homePage"][0]{
  heroHeadline,
  heroIntro,
  passions[]{ number, title, description },
  fullBio
}`

// ISR: cache the fetch and revalidate on an interval so edits in the Studio
// appear without a redeploy.
const REVALIDATE = 60

export const getHome = () =>
    client.fetch<HomeContent | null>(homeQuery, {}, { next: { revalidate: REVALIDATE } })

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
