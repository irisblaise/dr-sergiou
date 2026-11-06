#!/usr/bin/env node
// One-off migration: re-encode every raster image asset in the Sanity asset
// library as WebP, upload it as a new asset, and repoint every document
// field that referenced the old asset at the new one. Read-only by default
// (see --apply below) so the projected savings can be reviewed before any
// write touches the live dataset.
//
// Usage:
//   node --env-file=.env.local scripts/migrate-images-to-webp.mjs            # dry run (default)
//   node --env-file=.env.local scripts/migrate-images-to-webp.mjs --apply    # perform the migration
//   node --env-file=.env.local scripts/migrate-images-to-webp.mjs --apply --limit=3   # first N assets only
//   node --env-file=.env.local scripts/migrate-images-to-webp.mjs --delete-orphaned            # preview cleanup
//   node --env-file=.env.local scripts/migrate-images-to-webp.mjs --delete-orphaned --apply     # actually delete
import { createClient } from '@sanity/client'
import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const apply = process.argv.includes('--apply')
const deleteOrphaned = process.argv.includes('--delete-orphaned')
const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : Infinity

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) {
    console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET.')
    process.exit(1)
}
if (!token) {
    console.error('Missing SANITY_API_WRITE_TOKEN. Add a write token before running this script.')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01',
    token,
    useCdn: false,
})

// Formats worth re-encoding. SVG is vector (rasterizing it would be a
// regression) and WebP is already the target format — both are left alone.
const CONVERTIBLE_MIME = new Set(['image/png', 'image/jpeg', 'image/gif'])

function pathToString(segments) {
    return segments
        .map((seg, i) => {
            if (typeof seg === 'number') return `[${seg}]`
            if (typeof seg === 'object') return `[_key=="${seg._key}"]`
            return i === 0 ? seg : `.${seg}`
        })
        .join('')
}

// Generic tree walk so this doesn't need to know the schema: any object
// shaped like an image field (`{ asset: { _type: 'reference', _ref: 'image-...' } }`)
// is a hit, regardless of which document type or how deeply it's nested.
function findImageRefs(node, segments, hits) {
    if (Array.isArray(node)) {
        node.forEach((item, i) => {
            const seg = item && typeof item === 'object' && item._key ? { _key: item._key } : i
            findImageRefs(item, [...segments, seg], hits)
        })
        return
    }
    if (node && typeof node === 'object') {
        const ref = node.asset
        if (ref && ref._type === 'reference' && typeof ref._ref === 'string' && ref._ref.startsWith('image-')) {
            hits.push({ path: [...segments, 'asset'], assetId: ref._ref })
        }
        for (const [key, value] of Object.entries(node)) {
            if (key.startsWith('_')) continue
            findImageRefs(value, [...segments, key], hits)
        }
    }
}

async function encodeWebp(buffer) {
    const [lossy, lossless] = await Promise.all([
        sharp(buffer, { animated: true }).webp({ quality: 85, effort: 6 }).toBuffer(),
        sharp(buffer, { animated: true }).webp({ lossless: true, effort: 6 }).toBuffer(),
    ])
    return lossy.length <= lossless.length ? lossy : lossless
}

const assets = await client.fetch(
    `*[_type == "sanity.imageAsset"]{ _id, url, originalFilename, mimeType, size }`,
)

if (deleteOrphaned) {
    // Only ever considers assets in the pre-migration formats, so this can
    // never touch a WebP/SVG/AVIF asset that happens to be unused for some
    // unrelated reason — it's scoped to cleaning up what this script itself
    // superseded.
    const candidates = assets.filter((a) => CONVERTIBLE_MIME.has(a.mimeType))
    const orphaned = []
    for (const a of candidates) {
        const refCount = await client.fetch('count(*[references($id)])', { id: a._id })
        if (refCount === 0) orphaned.push(a)
    }
    const totalSize = orphaned.reduce((s, a) => s + a.size, 0)
    console.log(`${apply ? 'Deleting' : 'Would delete'} ${orphaned.length} orphaned original(s), reclaiming ${(totalSize / 1024 / 1024).toFixed(1)}MB:`)
    for (const a of orphaned) console.log(`  ${a.originalFilename.padEnd(45)} ${(a.size / 1024).toFixed(0)}KB  ${a._id}`)

    if (apply && orphaned.length > 0) {
        let tx = client.transaction()
        for (const a of orphaned) tx = tx.delete(a._id)
        await tx.commit()
        console.log('\nDeleted.')
    } else if (!apply) {
        console.log('\nDry run complete. Re-run with --delete-orphaned --apply to actually delete these.')
    }
    process.exit(0)
}

console.log(apply ? 'Running LIVE migration (writes enabled).' : 'Dry run (no writes) — pass --apply to perform the migration.')

const targets = assets.filter((a) => CONVERTIBLE_MIME.has(a.mimeType)).slice(0, limit)
const skipped = assets.filter((a) => !CONVERTIBLE_MIME.has(a.mimeType))

console.log(`\nFound ${assets.length} image assets: ${targets.length} to convert, ${skipped.length} skipped (already WebP, SVG, or AVIF).`)
for (const s of skipped) console.log(`  skip  ${s.mimeType.padEnd(14)} ${s.originalFilename}`)

if (apply) {
    await mkdir('scripts/backups', { recursive: true })
    const allDocs = await client.fetch('*[]')
    const backupPath = path.join('scripts/backups', `sanity-backup-${dataset}-${Date.now()}.json`)
    await writeFile(backupPath, JSON.stringify(allDocs, null, 2))
    console.log(`\nBacked up ${allDocs.length} documents to ${backupPath} before making any changes.`)
}

const idMap = new Map() // oldAssetId -> newAssetId
let totalBefore = 0
let totalAfter = 0
let kept = 0

console.log('\nConverting:')
for (const asset of targets) {
    const res = await fetch(asset.url)
    const buffer = Buffer.from(await res.arrayBuffer())
    const webp = await encodeWebp(buffer)

    // Re-encoding an already-compressed JPEG as WebP doesn't always shrink
    // it — when it wouldn't help, leave the original in place rather than
    // trading size for format consistency.
    if (webp.length >= asset.size) {
        kept += 1
        totalBefore += asset.size
        totalAfter += asset.size
        console.log(`  ${asset.originalFilename.padEnd(45)} kept as-is (WebP would be larger: ${(webp.length / 1024).toFixed(0)}KB vs ${(asset.size / 1024).toFixed(0)}KB)`)
        continue
    }

    totalBefore += asset.size
    totalAfter += webp.length
    const pct = ((1 - webp.length / asset.size) * 100).toFixed(0)
    console.log(`  ${asset.originalFilename.padEnd(45)} ${(asset.size / 1024).toFixed(0)}KB -> ${(webp.length / 1024).toFixed(0)}KB (${pct}%)`)

    if (apply) {
        const filename = asset.originalFilename.replace(/\.[^.]+$/, '') + '.webp'
        const uploaded = await client.assets.upload('image', webp, { filename, contentType: 'image/webp' })
        idMap.set(asset._id, uploaded._id)
    }
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}% smaller), ${kept} file(s) kept in original format`)

if (!apply) {
    console.log('\nDry run complete. Re-run with --apply to upload the WebP versions and repoint documents at them.')
    process.exit(0)
}

if (idMap.size === 0) {
    console.log('\nNothing uploaded, nothing to repoint.')
    process.exit(0)
}

console.log('\nFinding documents that reference the converted assets...')
const oldIds = [...idMap.keys()]
const referencingDocs = await client.fetch('*[references($ids)]', { ids: oldIds })

let patchedDocs = 0
let patchedRefs = 0
let tx = client.transaction()
for (const doc of referencingDocs) {
    const hits = []
    findImageRefs(doc, [], hits)
    const relevant = hits.filter((h) => idMap.has(h.assetId))
    if (relevant.length === 0) continue

    const setPayload = {}
    for (const hit of relevant) {
        setPayload[pathToString(hit.path)] = { _type: 'reference', _ref: idMap.get(hit.assetId) }
    }
    tx = tx.patch(doc._id, (p) => p.set(setPayload))
    patchedDocs += 1
    patchedRefs += relevant.length
}

if (patchedDocs > 0) {
    await tx.commit()
}

console.log(`Repointed ${patchedRefs} image reference(s) across ${patchedDocs} document(s).`)
console.log(`\nOld assets are now unreferenced but NOT deleted (find them in Studio's media browser via "Unused" filter, or delete manually once you've verified the site).`)
console.log('Old asset IDs:', oldIds.join(', '))
