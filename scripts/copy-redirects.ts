import fs from 'node:fs'
import path from 'node:path'

const src = path.resolve('_dist_redirects')
const dest = path.resolve('dist/_redirects')

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest)
  console.log('✓ Copied _redirects to dist/')
}
else {
  console.log('⚠ _dist_redirects not found, skipping')
}
