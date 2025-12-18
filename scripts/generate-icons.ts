/**
 * Generate app icons from logo files
 * This script creates placeholder icons from the existing logo.svg
 * Replace these with your custom branding assets later.
 */

import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicDir = resolve(__dirname, '../public')

interface IconConfig {
  input: string
  output: string
  size: number
  background?: string
}

const icons: IconConfig[] = [
  {
    input: 'logo.svg',
    output: 'apple-touch-icon.png',
    size: 180,
    background: '#ffffff', // iOS requires solid background
  },
  {
    input: 'logo.svg',
    output: 'android-chrome-192x192.png',
    size: 192,
  },
  {
    input: 'logo.svg',
    output: 'android-chrome-512x512.png',
    size: 512,
  },
]

async function generateIcon(config: IconConfig) {
  const inputPath = resolve(publicDir, config.input)
  const outputPath = resolve(publicDir, config.output)

  // Skip if output already exists
  if (existsSync(outputPath)) {
    console.log(`✓ ${config.output} already exists, skipping...`)
    return
  }

  // Skip if input doesn't exist
  if (!existsSync(inputPath)) {
    console.warn(`⚠ ${config.input} not found, skipping ${config.output}`)
    return
  }

  try {
    console.log(`Generating ${config.output} (${config.size}x${config.size})...`)

    let pipeline = sharp(inputPath)
      .resize(config.size, config.size, {
        fit: 'contain',
        background: config.background || { r: 0, g: 0, b: 0, alpha: 0 },
      })

    // For iOS icons, flatten with background
    if (config.background) {
      pipeline = pipeline.flatten({ background: config.background })
    }

    await pipeline.png().toFile(outputPath)

    console.log(`✓ Generated ${config.output}`)
  }
  catch (error) {
    console.error(`✗ Failed to generate ${config.output}:`, error)
  }
}

async function main() {
  console.log('🎨 Generating app icons from logo...\n')

  for (const icon of icons) {
    await generateIcon(icon)
  }

  console.log('\n✨ Icon generation complete!')
  console.log('\n📝 Note: These are placeholder icons generated from your logo.')
  console.log('   For best results, replace them with custom-designed icons.')
  console.log('   See BRANDING_ASSETS_GUIDE.md for details.\n')
}

main().catch(console.error)
