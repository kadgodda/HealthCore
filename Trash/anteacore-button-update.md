# AnteaCore Button Component Update Summary

## Problem Fixed
The outline button variant was becoming invisible when used on backgrounds that matched the primary color, as both the border and text used the same primary color.

## Solutions Implemented

### 1. Enhanced Outline Variant
The existing `outline` variant now features:
- Semi-transparent background with backdrop blur effect
- Increased border width (2px) for better visibility
- Better contrast on colored backgrounds

### 2. New `outlineContrast` Variant
A new button variant specifically for primary-colored backgrounds:
- Light themes: White background with primary color text
- Dark themes: Dark semi-transparent background with white text
- High contrast borders for maximum visibility

### 3. SmartButton Component
An intelligent wrapper that automatically selects the appropriate variant:
- Detects parent background color
- Switches between `outline` and `outlineContrast` automatically
- Can be overridden with `forceVariant` prop

## Usage Examples

```tsx
import { Button, SmartButton } from '@anteacore/shared';

// Standard outline button (use on neutral backgrounds)
<Button variant="outline">Click me</Button>

// High contrast outline (use on primary-colored backgrounds)
<Button variant="outlineContrast">Click me</Button>

// Smart button - automatically adjusts based on background
<SmartButton>Auto-adjusting button</SmartButton>

// Force a specific variant
<SmartButton preferredVariant="outline" forceVariant>
  Always outline
</SmartButton>
```

## Updated Button Variants
- `primary` - Filled button with primary color
- `secondary` - Filled button with secondary background
- `outline` - Enhanced transparent with colored border
- `outlineContrast` - High contrast for colored backgrounds (NEW)
- `ghost` - Minimal style with hover effects

## CSS Updates
- Added RGB color variables for semi-transparent backgrounds
- Enhanced backdrop filter support for better contrast
- Theme-aware contrast adjustments

## Best Practices
1. Use `SmartButton` when background colors might vary
2. Use `outlineContrast` explicitly on primary-colored sections
3. Avoid using primary color as background for content areas
4. Test button visibility across all theme variants

## Migration
- Existing `outline` buttons will work better automatically
- Consider switching to `SmartButton` for dynamic contexts
- No breaking changes - fully backward compatible