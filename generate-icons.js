/**
 * Generate PNG icons for the LinkSentry extension using Canvas API.
 * Run: node generate-icons.js
 * Requires no external dependencies (uses built-in Node canvas workaround via HTML).
 */

const fs = require('fs');
const { createCanvas } = (() => {
    // Try to use sharp or canvas package — if not available, create SVG-based PNGs
    try {
        return require('canvas');
    } catch (e) {
        return { createCanvas: null };
    }
})();

// SVG template for the shield icon
function getSvg(size) {
    const s = size;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="g" x1="6" y1="4" x2="42" y2="46">
      <stop offset="0%" stop-color="#ff2d95"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <path d="M24 4L6 12V22C6 33.1 13.7 43.3 24 46C34.3 43.3 42 33.1 42 22V12L24 4Z"
        fill="url(#g)" stroke="#ff2d95" stroke-width="1.5"/>
  <path d="M20 24L23 27L29 19" stroke="#ffffff" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;
}

const sizes = [16, 48, 128];
const outDir = __dirname + '/url-safety-extension/icons';

sizes.forEach(size => {
    const svg = getSvg(size);
    const filename = `${outDir}/icon${size}.svg`;
    fs.writeFileSync(filename, svg);
    console.log(`Created ${filename}`);
});

// Also create a .png fallback notice
fs.writeFileSync(outDir + '/README.md',
    '# Icons\nSVG icons are provided. For PNG icons, convert these SVGs using any image tool.\nChrome extensions support SVG icons in manifest, but if you need PNG, use an online tool like https://svgtopng.com/\n');

console.log('Done! SVG icons created in', outDir);
