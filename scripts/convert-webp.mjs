import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const galleryDir = path.resolve('public/galeria');

if (!fs.existsSync(galleryDir)) {
  console.error(`El directorio ${galleryDir} no existe.`);
  process.exit(1);
}

const files = fs.readdirSync(galleryDir).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

console.log(`Encontradas ${files.length} imágenes para convertir en ${galleryDir}...\n`);

let totalOriginalBytes = 0;
let totalWebpBytes = 0;

for (const file of files) {
  const inputPath = path.join(galleryDir, file);
  const outputFileName = file.replace(/\.(jpe?g)$/i, '.webp');
  const outputPath = path.join(galleryDir, outputFileName);

  const originalStat = fs.statSync(inputPath);
  totalOriginalBytes += originalStat.size;

  await sharp(inputPath)
    .webp({ quality: 82, effort: 4 })
    .toFile(outputPath);

  const webpStat = fs.statSync(outputPath);
  totalWebpBytes += webpStat.size;

  const originalMB = (originalStat.size / (1024 * 1024)).toFixed(2);
  const webpKB = (webpStat.size / 1024).toFixed(1);
  const savedPercent = (((originalStat.size - webpStat.size) / originalStat.size) * 100).toFixed(1);

  console.log(`✓ ${file} (${originalMB} MB) -> ${outputFileName} (${webpKB} KB) [-${savedPercent}%]`);
}

const totalOriginalMB = (totalOriginalBytes / (1024 * 1024)).toFixed(2);
const totalWebpMB = (totalWebpBytes / (1024 * 1024)).toFixed(2);
const totalSavedPercent = (((totalOriginalBytes - totalWebpBytes) / totalOriginalBytes) * 100).toFixed(1);

console.log(`\n==============================================`);
console.log(`¡Conversión completada con éxito!`);
console.log(`Total original: ${totalOriginalMB} MB`);
console.log(`Total WebP:     ${totalWebpMB} MB`);
console.log(`Reducción neta: ${totalSavedPercent}% de ahorro`);
console.log(`==============================================`);
