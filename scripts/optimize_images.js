#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Image Optimization Script
 * This script optimizes PNG and SVG files for web use
 * 
 * Prerequisites:
 *   - For PNG compression: ImageMagick (convert command) or ffmpeg
 *   - For SVG optimization: svgo (npm install -g svgo) or manual optimization
 */

const assetsDir = path.join(__dirname, '../frontend/src/assets');

console.log('🖼️  Image Optimization Tool\n');
console.log('Current image sizes:');

const imagesToOptimize = [
    'logo.svg',
    'appointment_img.png',
    'header_img.png',
    'about_image.png',
    'contact_image.png'
];

// Show current sizes
imagesToOptimize.forEach(file => {
    const filePath = path.join(assetsDir, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        const color = sizeKB > 1000 ? '\x1b[31m' : sizeKB > 500 ? '\x1b[33m' : '\x1b[32m';
        const reset = '\x1b[0m';
        console.log(`  ${color}${file}: ${sizeKB}KB${reset}`);
    }
});

console.log('\n📝 Optimization Instructions:\n');

console.log('✅ For PNG files (appointment_img.png, header_img.png, about_image.png, contact_image.png):');
console.log('   1. Use an online tool: https://tinypng.com or https://compressor.io');
console.log('   2. Or use ImageMagick locally:');
console.log('      convert input.png -strip -quality 85% -resize 1200x800 output.png');
console.log('   3. Target size: < 500KB per image\n');

console.log('✅ For SVG file (logo.svg):');
console.log('   1. Use SVGO: npm install -g svgo && svgo logo.svg');
console.log('   2. Or simplify using https://jakearchibald.github.io/svgomg/');
console.log('   3. Target size: < 50KB\n');

console.log('💡 Tips:');
console.log('   - Resize images to match their display size (max 1200x800 for hero)');
console.log('   - Use 85% quality for JPEG-compressed PNGs');
console.log('   - Remove metadata with -strip flag\n');

console.log('⏱️  After optimization, run this script again to verify new sizes.\n');

// Try automatic compression if tools are available
console.log('🔧 Attempting automatic optimization...\n');

let optimized = 0;

// Try PNG optimization with ImageMagick
imagesToOptimize.filter(f => f.endsWith('.png')).forEach(file => {
    const filePath = path.join(assetsDir, file);
    const backupPath = filePath + '.bak';

    if (fs.existsSync(filePath) && !fs.existsSync(backupPath)) {
        try {
            // First, create a backup
            fs.copyFileSync(filePath, backupPath);

            // Try to optimize with ImageMagick
            try {
                execSync(`convert "${filePath}" -strip -quality 85 -resize 1200x800 "${filePath}"`, { stdio: 'pipe' });
                const newSize = Math.round(fs.statSync(filePath).size / 1024);
                console.log(`✓ Optimized ${file} → ${newSize}KB`);
                optimized++;
            } catch {
                // If ImageMagick not available, revert
                fs.copyFileSync(backupPath, filePath);
                console.log(`⚠ ImageMagick not found. Install with: sudo apt-get install imagemagick (Linux) or brew install imagemagick (Mac)`);
            }
        } catch (error) {
            console.log(`✗ Could not optimize ${file}: ${error.message}`);
            if (fs.existsSync(backupPath)) fs.unlinkSync(backupPath);
        }
    }
});

if (optimized > 0) {
    console.log(`\n✅ Successfully optimized ${optimized} image(s)!\n`);
} else {
    console.log('\n💻 To enable automatic optimization, install ImageMagick:');
    console.log('   macOS: brew install imagemagick');
    console.log('   Linux: sudo apt-get install imagemagick');
    console.log('   Windows: https://imagemagick.org/script/download.php\n');
}

console.log('🌟 After manual optimization, commit your images:');
console.log('   git add frontend/src/assets/');
console.log('   git commit -m "optimize: compress hero and page images"\n');
