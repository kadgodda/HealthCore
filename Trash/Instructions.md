# Button Text Color Resolution Instructions

## Problem Statement
The primary text color in system buttons/tabs in the Body Systems tab may match the primary theme color, causing contrast issues where text becomes invisible against similarly colored backgrounds. This is a fundamental theming issue that needs to be resolved at the anteacore-shared component level and verified in HealthCore implementations.

## Root Cause Analysis

### Current Behavior
- Buttons in the Body Systems tab (lines 205-214 in `frontend/src/components/BodySystemsNutrition.tsx`) use:
  - `variant="primary"` for active state
  - `variant="outline"` for inactive state
- Text color appears to inherit the primary theme color, which can clash with primary-colored backgrounds

### Expected Behavior
1. **Text Color**: Should always maintain high contrast
   - White text on dark/colored backgrounds
   - Black text (or theme equivalent) on light backgrounds
2. **Interactive States**:
   - Default: Clear, readable text
   - Hover: Fill effect with contrasting text
   - Active/Selected: Fill effect with contrasting text
3. **Never**: Primary-colored text on primary-colored backgrounds

## Investigation Checklist

### 1. Check anteacore-shared Button Component
```bash
# Look for Button component definition
@anteacore/shared/src/components/Button/Button.tsx
@anteacore/shared/src/components/Button/Button.module.css
```

**What to verify:**
- [ ] Default text color for each variant (primary, outline, secondary, etc.)
- [ ] Hover state text color transitions
- [ ] Active/selected state text colors
- [ ] Theme variable usage for text colors
- [ ] Accessibility contrast ratios

### 2. Check Theme Configuration
```bash
# Look for theme files
@anteacore/shared/src/theme/
@anteacore/shared/src/styles/variables.css
```

**What to verify:**
- [ ] CSS custom properties for button text colors
- [ ] Theme color definitions
- [ ] Contrast color utilities (e.g., `--text-on-primary`, `--text-on-secondary`)

### 3. Check HealthCore Overrides
```bash
# Already identified files:
frontend/src/components/BodySystemsNutrition.tsx (lines 205-214)
frontend/src/components/BodySystemsNutrition.module.css (lines 105-114)
```

**What to verify:**
- [ ] No custom text color overrides that break theme consistency
- [ ] Proper usage of Button component variants
- [ ] CSS module styles don't override button text colors inappropriately

## Implementation Steps

### Phase 1: Fix anteacore-shared (Root Cause)

1. **Update Button Component CSS**:
```css
/* Example fix for Button.module.css */
.button {
  /* Base styles */
  transition: all 0.2s ease;
}

.button.primary {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary, white);
  border: 1px solid var(--color-primary);
}

.button.primary:hover {
  background-color: var(--color-primary-dark);
  color: var(--color-text-on-primary, white);
}

.button.outline {
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.button.outline:hover {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary, white);
  border-color: var(--color-primary);
}

/* Active/Selected state */
.button.outline.active,
.button.outline[aria-pressed="true"] {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary, white);
}
```

2. **Add Theme Contrast Utilities**:
```css
/* Theme variables */
:root {
  --color-primary: #667eea;
  --color-text-primary: #1e293b;
  --color-text-on-primary: #ffffff;
  --color-text-on-secondary: #ffffff;
  --color-text-on-dark: #ffffff;
  --color-text-on-light: #1e293b;
}
```

### Phase 2: Update HealthCore Implementation

1. **Remove any text color overrides** in `BodySystemsNutrition.module.css`
2. **Ensure proper variant usage**:
```tsx
<Button
  variant={activeSystem === key ? 'primary' : 'outline'}
  onClick={() => setActiveSystem(key)}
  className={styles.systemTab}
>
```

3. **Test all button states**:
   - Default outline state
   - Hover on outline
   - Active/primary state
   - Hover on primary

### Phase 3: Verification

1. **Visual Testing**:
   - [ ] All button text is readable in all states
   - [ ] Smooth transitions between states
   - [ ] Consistent behavior across all Button instances

2. **Accessibility Testing**:
   - [ ] WCAG AA contrast ratios (4.5:1 for normal text)
   - [ ] Keyboard navigation visibility
   - [ ] Screen reader compatibility

3. **Cross-theme Testing**:
   - [ ] Light theme
   - [ ] Dark theme
   - [ ] High contrast mode

## Success Criteria

1. **anteacore-shared**: Button component always provides contrasting text colors
2. **HealthCore**: No local overrides that break the theme system
3. **User Experience**: Clear visual feedback for all button states
4. **Accessibility**: WCAG AA compliant contrast ratios

## Notes

- This fix should be implemented in anteacore-shared first to benefit all projects using the component library
- HealthCore should not need custom button text color styling if anteacore-shared is properly configured
- Consider adding a `forceContrast` prop to Button component for edge cases where automatic contrast detection might fail