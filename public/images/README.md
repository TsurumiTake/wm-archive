# Image assets

The current SVGs are original, abstract placeholders. They are intentionally local and contain no photos of real people.

Replace images by keeping the same file path and changing the file contents, or by editing the centralized paths in:

`src/lib/media.ts`

Recommended folders:

- `hero/` — homepage hero image
- `woni/` — Woni portrait and profile images
- `minami/` — Minami portrait and profile images
- `duo/` — Woni × Minami images
- `moments/` — individual moment images

Use `.webp` or `.avif` for final photos when possible. Keep meaningful `alt`, `source`, and `credit` values in `src/data/moments.ts`.
