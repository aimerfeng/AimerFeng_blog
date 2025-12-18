# Asset Specifications Quick Reference

Quick reference for all branding asset requirements.

## Logo Files

| File | Format | Size | Notes |
|------|--------|------|-------|
| `logo.svg` | SVG | Scalable | Main logo for light theme, transparent background |
| `logo-dark.svg` | SVG | Scalable | Logo for dark theme (optional if logo works in both) |
| `logo.png` | PNG | ~200x200 | Fallback, transparent background |

**Design Guidelines:**
- Keep it simple and recognizable at small sizes
- Use `currentColor` in SVG for theme adaptation
- Optimize file size (< 10KB recommended)
- Test at various sizes (32px to 200px)

## Favicon Files

| File | Format | Size | Notes |
|------|--------|------|-------|
| `favicon.svg` | SVG | 32x32 viewBox | Scalable, modern browsers |
| `favicon.png` | PNG | 32x32 px | Fallback for older browsers |

**Design Guidelines:**
- Simplified version of your logo
- Clear at 16x16 and 32x32 pixels
- High contrast for visibility
- Transparent background (PNG)

## App Icons (Mobile)

| File | Format | Size | Purpose |
|------|--------|------|---------|
| `apple-touch-icon.png` | PNG | 180x180 px | iOS home screen |
| `android-chrome-192x192.png` | PNG | 192x192 px | Android home screen |
| `android-chrome-512x512.png` | PNG | 512x512 px | Android high-res |

**Design Guidelines:**
- **iOS**: Solid background (no transparency), corners rounded by system
- **Android**: Can use transparency, full bleed design
- Center your logo with padding (~20% margin)
- Test on actual devices

## Open Graph Image

| File | Format | Size | Purpose |
|------|--------|------|---------|
| `og.png` | PNG/JPG | 1200x630 px | Social media sharing |

**Design Guidelines:**
- Include your logo and site name
- Use readable fonts (min 40px)
- Safe zone: 1200x600 (avoid edges)
- Test at thumbnail size
- File size < 1MB recommended

## Avatar & Banner

| File | Format | Size | Purpose |
|------|--------|------|---------|
| `avatar.png` | PNG | 400x400 px | Profile picture |
| `banner.svg` | SVG | Variable | Site banner/header |

## File Size Targets

| Asset Type | Target Size | Max Size |
|------------|-------------|----------|
| SVG Logo | < 10 KB | 20 KB |
| PNG Favicon | < 5 KB | 10 KB |
| App Icons | < 20 KB each | 50 KB |
| OG Image | < 200 KB | 1 MB |

## Color Specifications

### Theme Colors

```css
/* Light Theme */
--primary: #ffffff
--background: #ffffff
--text: #1a1a1a

/* Dark Theme */
--primary: #1a1a1a
--background: #1a1a1a
--text: #ffffff
```

### Logo Colors

- Use colors that work in both light and dark themes
- Or provide separate versions for each theme
- Consider using `currentColor` in SVG for automatic adaptation

## Optimization Tools

### SVG Optimization
- [SVGOMG](https://jakearchibald.github.io/svgomg/)
- Settings: Precision 2, Remove viewBox: No

### PNG Compression
- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)

### Icon Generation
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

## Testing Checklist

### Visual Testing
- [ ] Logo clear at 32px, 64px, 128px, 200px
- [ ] Favicon recognizable at 16px
- [ ] App icons look good on home screen
- [ ] OG image readable at thumbnail size

### Technical Testing
- [ ] SVG files valid (no errors in browser)
- [ ] PNG files have transparency (where needed)
- [ ] File sizes within targets
- [ ] All files in correct locations

### Browser Testing
- [ ] Chrome/Edge (Windows, Mac)
- [ ] Firefox
- [ ] Safari (Mac, iOS)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### Social Media Testing
- [ ] Facebook preview
- [ ] Twitter preview
- [ ] LinkedIn preview
- [ ] Discord preview

## Quick Commands

```bash
# Generate icons from logo
npm run generate-icons

# Test locally
npm run dev

# Build for production
npm run build
```

## File Checklist

Copy this to track your progress:

```
[ ] public/logo.svg
[ ] public/logo-dark.svg
[ ] public/favicon.svg
[ ] public/favicon.png
[ ] public/apple-touch-icon.png
[ ] public/android-chrome-192x192.png
[ ] public/android-chrome-512x512.png
[ ] public/og.png
[ ] public/avatar.png (optional)
[ ] public/site.webmanifest (auto-generated)
```

## Common Issues

### Favicon not updating
- Clear browser cache completely
- Hard refresh (Ctrl+F5)
- Check file path in index.html
- Wait 5-10 minutes for browser to refresh

### Icons blurry on mobile
- Ensure exact pixel dimensions
- Use PNG, not JPG
- Don't scale up from smaller images
- Export at 2x and scale down

### OG image not showing
- Verify exact 1200x630 size
- Use absolute URL in meta tags
- Clear social media cache
- Wait 24-48 hours for some platforms

### Logo not appearing in loading animation
- Check file path is correct
- Verify SVG is valid
- Check browser console for errors
- Ensure file is in public/ directory

---

**Need more details?** See `BRANDING_ASSETS_GUIDE.md` for comprehensive instructions.
