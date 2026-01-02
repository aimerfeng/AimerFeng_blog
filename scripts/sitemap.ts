import { dirname } from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import matter from 'gray-matter'

const DOMAIN = 'https://aimer-feng-blog.vercel.app'

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

async function generateSitemap() {
  const urls: SitemapUrl[] = []

  // Add static pages
  urls.push(
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/projects', changefreq: 'weekly', priority: 0.9 },
    { loc: '/posts', changefreq: 'daily', priority: 0.9 },
    { loc: '/resume', changefreq: 'monthly', priority: 0.8 },
  )

  // Add blog posts
  const postFiles = await fg('pages/posts/*.md')
  for (const file of postFiles) {
    if (file.includes('index'))
      continue

    const raw = await fs.readFile(file, 'utf-8')
    const { data } = matter(raw)

    const slug = file.replace(/^pages(.+)\.md$/, '$1')
    const lastmod = data.date ? new Date(data.date).toISOString().split('T')[0] : undefined

    urls.push({
      loc: slug,
      lastmod,
      changefreq: 'monthly',
      priority: 0.7,
    })
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${DOMAIN}${url.loc}</loc>
${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>\n` : ''}    <changefreq>${url.changefreq || 'monthly'}</changefreq>
    <priority>${url.priority || 0.5}</priority>
  </url>`).join('\n')}
</urlset>`

  await fs.ensureDir(dirname('./dist/sitemap.xml'))
  await fs.writeFile('./dist/sitemap.xml', xml, 'utf-8')
  console.log('✓ Generated sitemap.xml')
}

generateSitemap()
