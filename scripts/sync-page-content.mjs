#!/usr/bin/env node
import { createClient } from '@sanity/client'

const dryRun = process.argv.includes('--dry-run')

const makeKey = (prefix, value, index) => {
  const seed = String(value ?? 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20) || 'item'

  return `${prefix}-${index}-${seed}`
}

const pageContent = [
  {
    page: 'projects',
    heading: 'Projects',
    eyebrow: 'TRACE THE JOURNEY',
    intro: [
      'Ongoing and past research projects that connect neuroscience, behaviour, and technology to questions of justice and society.',
      'Each line of work reflects a different thread in the same wider field of inquiry — from research design to public impact.',
    ],
  },
  {
    page: 'skills',
    heading: 'Skills',
    eyebrow: 'MAP THE NETWORK',
    intro: [
      'Expertise across neuroscience, technology, and human behavior — branches of one connected network, applied to questions of justice and society.',
    ],
  },
  {
    page: 'publications',
    heading: 'Publications',
    eyebrow: 'RESEARCH THAT BUILDS UNDERSTANDING AND DRIVES CHANGE.',
    intro: [
      'A collection of peer-reviewed articles, book chapters and reviews on neuroscience, behavior, and forensic science.',
    ],
  },
  {
    page: 'impact',
    heading: 'Impact',
    eyebrow: 'IMPACT IN SOCIETY.',
    intro: [
      "Media coverage, interviews, and awards reflecting the reach of Dr. Carmen-Silva Sergiou's research.",
    ],
  },
  {
    page: 'contact',
    heading: 'Get in touch',
    eyebrow: "LET'S CONNECT",
    intro: [
      'Reach Dr. Carmen-Silva Sergiou for research collaborations, talks, interviews, or anything at the crossroads of neuroscience and technology.',
    ],
    contactDetails: [
      {
        _key: 'contact-primary',
        label: 'PRIMARY CONTACT',
        value: 'cs.sergiou@gmail.com',
        href: 'mailto:cs.sergiou@gmail.com',
        note: 'Personal and general inquiries',
      },
      {
        _key: 'contact-forneurotech',
        label: 'FORNEUROTECH CONTACT',
        value: 'forneurotech.network@gmail.com',
        href: 'mailto:forneurotech.network@gmail.com',
        note: 'Research collaborations and neurotechnology inquiries',
      },
    ],
    position: 'Postdoctoral researcher',
    institution: 'Amsterdam UMC — Youth at Risk',
    socialLinks: [
      { _key: 'social-linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/carmensergiou' },
      { _key: 'social-orcid', label: 'ORCID', href: 'https://orcid.org/0000-0002-8107-5615' },
    ],
  },
]

const requiredEnv = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET']
const missingEnv = requiredEnv.filter((key) => !process.env[key])

if (!dryRun && missingEnv.length > 0) {
  console.error(`Missing required env vars: ${missingEnv.join(', ')}`)
  process.exit(1)
}

if (dryRun && missingEnv.length > 0) {
  console.log('Dry run: missing env vars detected, so no write will happen.')
  console.log('Would sync the following page content records:')
  for (const page of pageContent) {
    console.log(JSON.stringify(page, null, 2))
  }
  process.exit(0)
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN. Add a write token before running the real sync.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01',
  token,
  useCdn: false,
})

for (const item of pageContent) {
  const existing = await client.fetch(
    `*[_type == "pageContent" && page == $page][0]{ _id, _type, page }`,
    { page: item.page },
  )

  const payload = {
    _type: 'pageContent',
    page: item.page,
    heading: item.heading,
    eyebrow: item.eyebrow,
    intro: item.intro ?? [],
    contactDetails: item.contactDetails?.map((detail, index) => ({
      _key: detail._key || makeKey('contact', detail.label || detail.value || index, index),
      label: detail.label,
      value: detail.value,
      href: detail.href,
      note: detail.note,
    })),
    position: item.position,
    institution: item.institution,
    socialLinks: item.socialLinks?.map((link, index) => ({
      _key: link._key || makeKey('social', link.label || link.href || index, index),
      label: link.label,
      href: link.href,
    })),
  }

  if (existing) {
    await client.patch(existing._id).set(payload).commit()
    console.log(`Updated pageContent for ${item.page}`)
  } else {
    await client.create(payload)
    console.log(`Created pageContent for ${item.page}`)
  }
}

console.log('Page content sync complete.')
