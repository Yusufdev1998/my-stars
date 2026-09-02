# PWA Setup Guide for Yulduzlar Osmoni

Your app has been configured as a Progressive Web App (PWA). Here's what was added and how to complete the setup.

## ✅ What's Been Done

### 1. **Manifest File** (`/public/manifest.json`)
- Defines app metadata, icons, and installation settings
- Sets theme colors and display mode
- Includes app shortcuts for quick navigation

### 2. **Service Worker** (`/public/sw.js`)
- Handles offline functionality
- Implements cache-first strategy for assets
- Supports background sync for pending updates
- Automatically updates when new version is deployed

### 3. **Updated Layout** (`/app/layout.js`)
- Added viewport meta tags for mobile
- PWA-specific metadata (theme-color, apple-mobile-web-app-capable, etc.)
- Integrated service worker registration component

### 4. **Service Worker Registration** (`/components/ServiceWorkerRegister.js`)
- Registers the service worker on app load
- Shows install prompt for users
- Checks for updates periodically

### 5. **Offline Page** (`/app/offline/page.js`)
- Graceful offline fallback
- Displayed when user is offline and accessing uncached content
- Auto-redirects when connection is restored

## 📱 Next Steps: Generate App Icons

The manifest references icons that need to be created. You need to generate these icon sizes:

### Required Icon Sizes:
- **192x192px** (`/public/icon-192.png`) - Standard icon
- **512x512px** (`/public/icon-512.png`) - Large icon
- **192x192px maskable** (`/public/icon-maskable-192.png`) - For adaptive icons
- **512x512px maskable** (`/public/icon-maskable-512.png`) - For adaptive icons
- **96x96px** (`/public/icon-96.png`) - For shortcuts

### Icon Guidelines:
- **Format**: PNG with transparency
- **Safe zone**: Keep important content within inner circle (safe zone = 80% of icon size)
- **Maskable icons**: Must work when cropped to a circle (used on some Android devices)
- **Design**: Use your app logo or star theme

### How to Generate Icons:

#### Option 1: Use an Online Tool
1. Go to [PWA Image Generator](https://www.pwabuilder.com/imageGenerator)
2. Upload your logo/image
3. Generate all sizes
4. Download and place in `/public/`

#### Option 2: Use a Design Tool
1. Create your design in Figma, Adobe XD, or similar
2. Export as PNG at each required size
3. For maskable icons, ensure the design works in a circular mask

#### Option 3: Use ImageMagick (CLI)
```bash
# From a source icon (e.g., source-icon.png)
convert source-icon.png -resize 192x192 public/icon-192.png
convert source-icon.png -resize 512x512 public/icon-512.png
convert source-icon.png -resize 96x96 public/icon-96.png
# Maskable versions (same content, follows manifest)
cp public/icon-192.png public/icon-maskable-192.png
cp public/icon-512.png public/icon-maskable-512.png
```

### Screenshots (Optional but Recommended)
Also generate screenshots for the app store install prompt:
- **192x192** (`/public/screenshot-192.png`) - Narrow/mobile form factor
- **512x512** (`/public/screenshot-512.png`) - Wide form factor

## 🧪 Testing Your PWA

### 1. **Local Testing**
```bash
npm run build
npm run start
```

Then visit `http://localhost:3000` in your browser.

### 2. **Desktop Chrome/Edge Testing**
- Open DevTools (F12)
- Go to **Application** tab → **Manifest**
- Click "Add to shelf" or look for install prompt
- The install button should appear in the address bar

### 3. **Mobile Testing (Android)**
- Open the app in Chrome on Android
- Look for "Install app" prompt
- The app will appear as a standalone app on home screen

### 4. **Mobile Testing (iOS)**
- Open in Safari on iPhone/iPad
- Tap **Share** → **Add to Home Screen**
- App installs as standalone PWA

### 5. **Offline Testing**
1. Open DevTools → **Application** tab → **Service Workers**
2. Check "Offline" checkbox
3. Try navigating to cached pages (should work)
4. Try navigating to new pages (should show offline page)

## ⚙️ Configuration

### Customize Theme Colors
Edit these files to match your brand:

**`/public/manifest.json`** (lines 10-11):
```json
"theme_color": "#3b82f6",      // Header/taskbar color
"background_color": "#ffffff",  // Splash screen background
```

**`/app/layout.js`** (line 21):
```html
<meta name="theme-color" content="#3b82f6" />
```

### Customize App Shortcuts
Edit `/public/manifest.json` → `shortcuts` array to add more quick-access links:
```json
{
  "name": "Custom Shortcut Name",
  "short_name": "Shortcut",
  "description": "Description of what this does",
  "url": "/path/to/page",
  "icons": [...]
}
```

### Adjust Offline Behavior
Edit `/public/sw.js` to modify:
- **CACHE_NAME** - Change version (e.g., `"yulduzlar-osmoni-v2"`)
- **STATIC_ASSETS** - Add more pages to cache on install
- **Cache strategies** - Switch between cache-first, network-first, etc.

## 🔄 Updating the App

### When You Deploy New Versions:
1. Service worker automatically checks for updates every minute
2. When new version is detected, it's downloaded in background
3. User sees update notification (you can customize in ServiceWorkerRegister component)
4. Updates apply on next page refresh

### Manual Cache Busting:
If you need to force users to refresh cache, increment CACHE_NAME:
```javascript
// In /public/sw.js
const CACHE_NAME = "yulduzlar-osmoni-v2";  // Changed from v1
```

## 📊 PWA Quality Checklist

Your app now has:
- ✅ Web app manifest
- ✅ Service worker for offline support
- ✅ Mobile-friendly viewport settings
- ✅ Install prompts
- ✅ Offline fallback page
- ⏳ App icons (needs to be generated)
- ⏳ Screenshots (optional)

## 🐛 Troubleshooting

### Service Worker not registering?
- Check browser console for errors
- Ensure `/public/sw.js` is accessible
- Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Install prompt not showing?
- Icons may not be loaded - check `sw.js` and manifest
- Try in an incognito/private window
- Some browsers require specific conditions to show install prompt

### Offline page showing too much?
- The offline page catches requests to uncached URLs
- Adjust STATIC_ASSETS in `/public/sw.js` to cache more pages on install

### Cache not updating?
- Service workers cache aggressively
- Use different version in CACHE_NAME to force refresh
- Or manually clear site data in browser settings

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Builder](https://www.pwabuilder.com/)
- [Maskable Icons](https://web.dev/maskable-icon-audit/)

## 📦 Production Checklist

Before deploying to production:

- [ ] Generate all required icons (192, 512, maskable variants)
- [ ] Generate app screenshots (optional)
- [ ] Test on real mobile devices (iOS & Android)
- [ ] Test offline functionality
- [ ] Verify theme colors match brand
- [ ] Test installation from different browsers
- [ ] Set up analytics to track PWA installs
- [ ] Monitor service worker updates
- [ ] Test update process with users

## 🚀 Next: Deployment

Your PWA works best when served over HTTPS. Most hosting platforms handle this:
- Vercel (recommended for Next.js) - automatic HTTPS
- Netlify - automatic HTTPS
- Your own server - use Let's Encrypt for free SSL

The service worker will only register on HTTPS (or localhost for development).
