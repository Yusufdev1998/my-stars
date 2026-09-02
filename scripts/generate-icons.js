#!/usr/bin/env node

/**
 * PWA Icon Generator
 * Generates all required PWA icons for Yulduzlar Osmoni
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "../public");

// Create SVG for the star icon
const createStarSVG = (size) => `
<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#3b82f6"/>

  <!-- Stars pattern -->
  <g fill="#fbbf24">
    <!-- Main star -->
    <path d="M${size / 2} ${size * 0.15} L${size * 0.65} ${size * 0.35} L${size * 0.85} ${size * 0.15} L${size * 0.7} ${size * 0.35} L${size * 0.9} ${size * 0.65} L${size * 0.65} ${size * 0.5} L${size * 0.85} ${size * 0.85} L${size * 0.5} ${size * 0.65} L${size * 0.15} ${size * 0.85} L${size * 0.35} ${size * 0.5} L${size * 0.1} ${size * 0.65} L${size * 0.3} ${size * 0.35} L${size * 0.15} ${size * 0.15} L${size * 0.35} ${size * 0.35}"/>

    <!-- Top right small star -->
    <circle cx="${size * 0.75}" cy="${size * 0.2}" r="${size * 0.08}"/>

    <!-- Bottom left small star -->
    <circle cx="${size * 0.2}" cy="${size * 0.75}" r="${size * 0.08}"/>

    <!-- Bottom right small star -->
    <circle cx="${size * 0.8}" cy="${size * 0.8}" r="${size * 0.06}"/>
  </g>
</svg>
`;

// Create SVG for maskable icon (with safe zone padding)
const createMaskableSVG = (size) => `
<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Full background for maskable (will be cropped to circle) -->
  <rect width="${size}" height="${size}" fill="#3b82f6"/>

  <!-- Centered content for safe zone (80% of size) -->
  <g fill="#fbbf24">
    <!-- Main star centered -->
    <path d="M${size / 2} ${size * 0.2} L${size * 0.63} ${size * 0.37} L${size * 0.8} ${size * 0.2} L${size * 0.68} ${size * 0.37} L${size * 0.83} ${size * 0.62} L${size * 0.63} ${size * 0.51} L${size * 0.8} ${size * 0.8} L${size * 0.5} ${size * 0.61} L${size * 0.2} ${size * 0.8} L${size * 0.37} ${size * 0.51} L${size * 0.17} ${size * 0.62} L${size * 0.32} ${size * 0.37} L${size * 0.2} ${size * 0.2} L${size * 0.37} ${size * 0.37}"/>

    <!-- Small stars -->
    <circle cx="${size * 0.72}" cy="${size * 0.28}" r="${size * 0.07}"/>
    <circle cx="${size * 0.28}" cy="${size * 0.72}" r="${size * 0.07}"/>
  </g>
</svg>
`;

// Create screenshot SVG (wider format)
const createScreenshotSVG = (width, height) => `
<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#ffffff"/>

  <!-- Header bar -->
  <rect width="${width}" height="${height * 0.1}" fill="#3b82f6"/>

  <!-- App title -->
  <text x="${width * 0.5}" y="${height * 0.065}" font-size="${height * 0.06}" font-weight="bold" text-anchor="middle" fill="#ffffff" font-family="Arial">
    Yulduzlar Osmoni
  </text>

  <!-- Star grid -->
  <g fill="none" stroke="#3b82f6" stroke-width="2">
    <rect x="${width * 0.05}" y="${height * 0.15}" width="${width * 0.9}" height="${height * 0.7}" rx="10"/>
  </g>

  <!-- Stars decoration -->
  <g fill="#fbbf24" opacity="0.8">
    <!-- Top left star -->
    <circle cx="${width * 0.15}" cy="${height * 0.25}" r="${width * 0.06}"/>
    <!-- Center star -->
    <circle cx="${width * 0.5}" cy="${height * 0.45}" r="${width * 0.08}"/>
    <!-- Bottom right star -->
    <circle cx="${width * 0.85}" cy="${height * 0.65}" r="${width * 0.06}"/>
  </g>

  <!-- Students list -->
  <g fill="#cbd5e1" stroke="none">
    <rect x="${width * 0.1}" y="${height * 0.2}" width="${width * 0.8}" height="${height * 0.05}" rx="4"/>
    <rect x="${width * 0.1}" y="${height * 0.28}" width="${width * 0.8}" height="${height * 0.05}" rx="4"/>
    <rect x="${width * 0.1}" y="${height * 0.36}" width="${width * 0.8}" height="${height * 0.05}" rx="4"/>
    <rect x="${width * 0.1}" y="${height * 0.44}" width="${width * 0.8}" height="${height * 0.05}" rx="4"/>
  </g>

  <!-- Footer button -->
  <rect x="${width * 0.25}" y="${height * 0.85}" width="${width * 0.5}" height="${height * 0.08}" rx="6" fill="#3b82f6"/>
  <text x="${width * 0.5}" y="${height * 0.915}" font-size="${height * 0.05}" font-weight="bold" text-anchor="middle" fill="#ffffff" font-family="Arial">
    Darsni yakunlash
  </text>
</svg>
`;

async function generateIcons() {
  console.log("🎨 Generating PWA Icons...\n");

  try {
    // Generate standard icons
    const sizes = [
      { name: "icon-192.png", size: 192 },
      { name: "icon-512.png", size: 512 },
      { name: "icon-96.png", size: 96 },
    ];

    for (const { name, size } of sizes) {
      const svgString = createStarSVG(size);
      const outputPath = path.join(publicDir, name);

      await sharp(Buffer.from(svgString))
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    // Generate maskable icons
    const maskableSizes = [
      { name: "icon-maskable-192.png", size: 192 },
      { name: "icon-maskable-512.png", size: 512 },
    ];

    for (const { name, size } of maskableSizes) {
      const svgString = createMaskableSVG(size);
      const outputPath = path.join(publicDir, name);

      await sharp(Buffer.from(svgString))
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    // Generate screenshot images
    const screenshots = [
      { name: "screenshot-192.png", width: 192, height: 192 },
      { name: "screenshot-512.png", width: 512, height: 512 },
    ];

    for (const { name, width, height } of screenshots) {
      const svgString = createScreenshotSVG(width, height);
      const outputPath = path.join(publicDir, name);

      await sharp(Buffer.from(svgString))
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${name} (${width}x${height})`);
    }

    // Also create Apple touch icon
    const appleTouchSVG = createStarSVG(180);
    await sharp(Buffer.from(appleTouchSVG))
      .png()
      .toFile(path.join(publicDir, "apple-touch-icon.png"));

    console.log(`✅ Generated apple-touch-icon.png (180x180)`);

    console.log("\n✨ All icons generated successfully!\n");
    console.log("📂 Icons created in /public/:");
    console.log("   ✓ icon-96.png");
    console.log("   ✓ icon-192.png");
    console.log("   ✓ icon-512.png");
    console.log("   ✓ icon-maskable-192.png");
    console.log("   ✓ icon-maskable-512.png");
    console.log("   ✓ apple-touch-icon.png");
    console.log("   ✓ screenshot-192.png");
    console.log("   ✓ screenshot-512.png\n");

    console.log("🚀 Ready to test! Run:");
    console.log("   npm run build");
    console.log("   npm run start\n");
  } catch (error) {
    console.error("❌ Error generating icons:", error.message);
    process.exit(1);
  }
}

generateIcons();
