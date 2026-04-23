/**
 * Convertit récursivement PNG/JPEG → WebP (qualité 85), supprime l’original.
 * Usage : node scripts/convert-to-webp.cjs
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..')
const SKIP_DIRS = new Set(['node_modules', '.next', '.git'])

const exts = new Set(['.png', '.jpg', '.jpeg'])

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (exts.has(path.extname(name).toLowerCase())) out.push(full)
  }
  return out
}

async function main() {
  const dirs = [
    path.join(ROOT, 'public'),
    path.join(ROOT, 'components', 'media'),
    path.join(ROOT, 'gallery'),
  ]
  const files = dirs.flatMap((d) => walk(d))
  if (!files.length) {
    console.log('Aucune image PNG/JPEG trouvée.')
    return
  }
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    const webp = file.slice(0, -ext.length) + '.webp'
    await sharp(file).webp({ quality: 85, effort: 4 }).toFile(webp)
    fs.unlinkSync(file)
    console.log('OK', path.relative(ROOT, file), '→', path.relative(ROOT, webp))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
