# Branding Assets Update Guide

This guide explains how to update all branding assets for your personal blog, including logos, favicons, app icons, and Open Graph images.

## Overview

The following assets need to be replaced with your custom branding:

### Required Assets

1. **Logo Files** (for loading animation and site branding)
   - `public/logo.svg` - Main logo (light theme)
   - `public/logo-dark.svg` - Dark theme logo
   - `public/logo.png` - PNG fallback (optional)

2. **Favicon Files** (browser tab icons)
   - `public/favicon.svg` - Scalable favicon (recommended)
   - `public/favicon.png` - PNG fallback (32x32)
   - `public/favicon-animated.svg` - Animated version (optional)
   - `public/favicon-animated-stroke.svg` - Animated stroke version (optional)

3. **App Icons** (mobile home screen)
   - `public/apple-touch-icon.png` - iOS icon (180x180)
   - `public/android-chrome-192x192.png` - Android icon (192x192)
   - `public/android-chrome-512x512.png` - Android icon (512x512)

4. **Open Graph Images** (social media sharing)
   - `public/og.png` - Default OG image (1200x630)
   - `public/og-icon.png` - Icon for OG (optional)

5. **Other Branding**
   - `public/avatar.png` - Your profile avatar
   - `public/banner.svg` - Site banner (optional)

## Asset Specifications

### Logo Files

**Format**: SVG (preferred) or PNG
**Size**: Scalable, but design for ~200x200px display
**Requirements**:
- Transparent background
- Clean, simple design that works at small sizes
- Separate light/dark versions if colors don't work in both themes
- File size < 10KB for optimal loading

**Example SVG structure**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Your logo paths here -->
  <path d="..." fill="currentColor"/>
</svg>
```

### Favicon Files

**favicon.svg**:
- Size: 32x32 viewBox (scalable)
- Format: SVG
- Should be a simplified version of your logo
- Use `currentColor` for theme adaptation

**favicon.png**:
- Size: 32x32 pixels
- Format: PNG with transparency
- Fallback for browsers that don't support SVG favicons

### App Icons

**apple-touch-icon.png**:
- Size: 180x180 pixels
- Format: PNG
- No transparency (use solid background)
- Rounded corners applied by iOS automatically

**android-chrome-192x192.png**:
- Size: 192x192 pixels
- Format: PNG with transparency
- Used for Android home screen

**android-chrome-512x512.png**:
- Size: 512x512 pixels
- Format: PNG with transparency
- High-resolution version for Android

### Open Graph Images

**og.png**:
- Size: 1200x630 pixels
- Format: PNG or JPG
- Used when sharing your site on social media
- Should include your logo/branding and site name
- Text should be readable at small sizes

## Step-by-Step Update Process

### Step 1: Prepare Your Assets

1. Create your logo design in your preferred design tool (Figma, Illustrator, etc.)
2. Export in the required formats and sizes
3. Optimize file sizes:
   - Use [SVGOMG](https://jakearchibald.github.io/svgomg/) for SVG optimization
   - Use [TinyPNG](https://tinypng.com/) for PNG compression

### Step 2: Backup Current Assets

```bash
# Create backup directory
mkdir -p aimerfeng-blog/public/backup-assets

# Backup current assets
cp aimerfeng-blog/public/logo.svg aimerfeng-blog/public/backup-assets/
cp aimerfeng-blog/public/logo-dark.svg aimerfeng-blog/public/backup-assets/
cp aimerfeng-blog/public/favicon.svg aimerfeng-blog/public/backup-assets/
cp aimerfeng-blog/public/favicon.png aimerfeng-blog/public/backup-assets/
cp aimerfeng-blog/public/og.png aimerfeng-blog/public/backup-assets/
```

### Step 3: Replace Assets

Copy your prepared assets to the public directory:

```bash
# Logo files
cp /path/to/your/logo.svg aimerfeng-blog/public/logo.svg
cp /path/to/your/logo-dark.svg aimerfeng-blog/public/logo-dark.svg

# Favicon files
cp /path/to/your/favicon.svg aimerfeng-blog/public/favicon.svg
cp /path/to/your/favicon.png aimerfeng-blog/public/favicon.png

# App icons (create if they don't exist)
cp /path/to/your/apple-touch-icon.png aimerfeng-blog/public/apple-touch-icon.png
cp /path/to/your/android-chrome-192x192.png aimerfeng-blog/public/android-chrome-192x192.png
cp /path/to/your/android-chrome-512x512.png aimerfeng-blog/public/android-chrome-512x512.png

# Open Graph image
cp /path/to/your/og.png aimerfeng-blog/public/og.png
```

### Step 4: Update HTML Meta Tags

The `index.html` file needs to be updated to reference all icon sizes. Update the `<head>` section:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="author" content="Your Name" />
  <meta http-equiv="X-UA-Compatible" content="chrome=1" />
  <meta name="revisit-after" content="7 days" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Favicon -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/favicon.png" type="image/png" />
  
  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  
  <!-- Android Chrome Icons -->
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
  
  <!-- Open Graph / Social Media -->
  <meta property="og:image" content="https://yourdomain.com/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://yourdomain.com/og.png" />
  
  <meta name="msapplication-TileColor" content="#ffffff" />
  <link rel="alternate" type="application/rss+xml" title="Your Blog" href="/feed.xml" />
  <title>Your Name</title>
  
  <!-- Theme detection script -->
  <script>
    ;(function () {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const setting = localStorage.getItem('vueuse-color-scheme') || 'auto'
      if (setting === 'dark' || (prefersDark && setting !== 'light'))
        document.documentElement.classList.toggle('dark', true)
    })()
  </script>
</head>
```

### Step 5: Create Web App Manifest (Optional)

Create `public/site.webmanifest` for PWA support:

```json
{
  "name": "Your Name - Blog",
  "short_name": "Your Blog",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

Then add to `index.html`:
```html
<link rel="manifest" href="/site.webmanifest" />
```

### Step 6: Test Your Assets

1. **Local Testing**:
   ```bash
   cd aimerfeng-blog
   pnpm dev
   ```
   - Check the browser tab for favicon
   - Inspect the loading animation for logo
   - Test light/dark theme switching

2. **Favicon Testing**:
   - Open browser dev tools
   - Check Network tab for favicon requests
   - Verify correct file is loaded

3. **Mobile Testing**:
   - Test on iOS Safari (add to home screen)
   - Test on Android Chrome (add to home screen)
   - Verify icons appear correctly

4. **Social Media Testing**:
   - Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - Use [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Step 7: Clear Browser Cache

After updating assets, clear your browser cache to see changes:
- Chrome: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
- Or use hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

## Troubleshooting

### Logo not appearing in loading animation
- Check file path in `LoadingAnimation.vue`
- Verify SVG is valid (test in browser directly)
- Check browser console for errors

### Favicon not updating
- Clear browser cache completely
- Check `index.html` has correct path
- Try accessing favicon directly: `http://localhost:5173/favicon.svg`

### App icons not showing on mobile
- Verify file sizes are exact (180x180, 192x192, 512x512)
- Check PNG format and transparency
- Re-add to home screen after clearing cache

### OG image not showing in social media
- Verify image is exactly 1200x630 pixels
- Check absolute URL is used (not relative)
- Use social media debugger tools to refresh cache
- Wait 24-48 hours for some platforms to update

## Quick Reference: File Checklist

- [ ] `public/logo.svg` - Main logo (light theme)
- [ ] `public/logo-dark.svg` - Dark theme logo
- [ ] `public/favicon.svg` - Scalable favicon
- [ ] `public/favicon.png` - PNG favicon fallback
- [ ] `public/apple-touch-icon.png` - iOS icon (180x180)
- [ ] `public/android-chrome-192x192.png` - Android icon (192x192)
- [ ] `public/android-chrome-512x512.png` - Android icon (512x512)
- [ ] `public/og.png` - Open Graph image (1200x630)
- [ ] `public/avatar.png` - Profile avatar
- [ ] `index.html` - Updated meta tags
- [ ] `public/site.webmanifest` - Web app manifest (optional)

## Resources

- [Favicon Generator](https://realfavicongenerator.net/)
- [SVGOMG - SVG Optimizer](https://jakearchibald.github.io/svgomg/)
- [TinyPNG - PNG Compressor](https://tinypng.com/)
- [Open Graph Protocol](https://ogp.me/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## Next Steps

After updating your branding assets:
1. Proceed to Task 2: Modify LoadingAnimation component to use custom logo
2. Test the complete loading flow with your new branding
3. Deploy and verify on production

---

**Note**: Keep your original design files (Figma, AI, etc.) in a safe place for future updates!
