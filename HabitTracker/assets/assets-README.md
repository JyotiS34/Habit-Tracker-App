# Assets Directory

This directory contains all the static assets for the Habit Tracker app.

## Required Files

### App Icons
- `icon.png` - Main app icon (1024x1024)
- `adaptive-icon.png` - Android adaptive icon (1024x1024)
- `favicon.png` - Web favicon (48x48)

### Splash Screen
- `splash.png` - App splash screen (1242x2436)

### Notification
- `notification-icon.png` - Notification icon (96x96)

## Icon Specifications

### App Icon (icon.png)
- Size: 1024x1024 pixels
- Format: PNG
- Background: White or transparent
- Design: Simple, recognizable habit tracking icon

### Adaptive Icon (adaptive-icon.png)
- Size: 1024x1024 pixels
- Format: PNG
- Foreground: Icon design
- Background: Solid color (will be masked by Android)

### Splash Screen (splash.png)
- Size: 1242x2436 pixels (iPhone X resolution)
- Format: PNG
- Content: App logo and name
- Background: White or brand color

### Notification Icon (notification-icon.png)
- Size: 96x96 pixels
- Format: PNG
- Design: Simple icon that works well at small sizes

## Design Guidelines

1. **Consistency**: Use consistent design language across all icons
2. **Simplicity**: Keep designs simple and recognizable
3. **Contrast**: Ensure good contrast for visibility
4. **Scalability**: Design should work at various sizes
5. **Brand Colors**: Use the app's primary color (#6366f1)

## Placeholder Icons

For development, you can use placeholder icons or create simple designs using:
- Habit tracking symbols (checkmarks, calendars, etc.)
- Minimalist designs
- The app's color scheme (#6366f1 primary color)

## Implementation Notes

- Icons are referenced in `app.json`
- Splash screen is configured in Expo settings
- Notification icon is used for push notifications
- All assets should be optimized for file size
