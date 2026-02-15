import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const imageDir = './public/images'
const images = [
  'emily-dickinson.jpg',
  'edgar-allan-poe.jpg',
  'william-wordsworth.jpg',
]

async function optimizeImages() {
  console.log('[v0] Starting image optimization...')

  for (const image of images) {
    const imagePath = path.join(imageDir, image)

    if (!fs.existsSync(imagePath)) {
      console.warn(`[v0] Image not found: ${imagePath}`)
      continue
    }

    try {
      // Get original size
      const originalStats = fs.statSync(imagePath)
      const originalSize = originalStats.size / 1024 // KB

      // Optimize and compress
      await sharp(imagePath)
        .resize(300, 400, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 80, progressive: true })
        .toFile(`${imagePath}.optimized`)

      // Replace original with optimized
      fs.renameSync(`${imagePath}.optimized`, imagePath)

      const optimizedStats = fs.statSync(imagePath)
      const optimizedSize = optimizedStats.size / 1024
      const reduction = (((originalSize - optimizedSize) / originalSize) * 100).toFixed(1)

      console.log(
        `[v0] Optimized ${image}: ${originalSize.toFixed(1)}KB → ${optimizedSize.toFixed(1)}KB (-${reduction}%)`
      )
    } catch (error) {
      console.error(`[v0] Error optimizing ${image}:`, error.message)
    }
  }

  console.log('[v0] Image optimization complete!')
}

optimizeImages().catch(console.error)
