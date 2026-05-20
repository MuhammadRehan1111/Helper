// generate-icons.js
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const bgColor = '#6366f1';
const text = 'H';
const fontFamily = 'sans-serif';

const outputDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);
  // Rounded corners
  const radius = Math.round(size * 0.1);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  // Text (white, bold)
  ctx.fillStyle = '#ffffff';
  const fontSize = Math.round(size * 0.6);
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);
  const buffer = canvas.toBuffer('image/png');
  const outPath = path.join(outputDir, `icon-${size}.png`);
  fs.writeFileSync(outPath, buffer);
});

console.log('Generated icons in', outputDir);
