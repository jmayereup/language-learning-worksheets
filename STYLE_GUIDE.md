# TJ Components Style Guide

This guide outlines the design system and styling approach for all custom web components in the `tj-components` library. By following these guidelines, you ensure a uniform, premium look and feel across all components while preventing style leakage when embedded in external platforms like Ghost blogs.


## Design Tokens (CSS Variables)

All tokens are defined on the `:host` pseudo-class and prefixed with `--tj-` to prevent collisions.

### Color Palette

**Primary (Blue)** - Used for primary actions, active states, highlights.
- `--tj-primary-color` (`#2563eb`)
- `--tj-primary-hover` (`#1d4ed8`)
- `--tj-primary-light` (`#eff6ff`)
- `--tj-primary-border` (`#bfdbfe`)

**Success (Green)** - Used for correct answers, completed tasks.
- `--tj-success-color` (`#22c55e`)
- `--tj-success-light` (`#f0fdf4`)

**Error/Danger (Red)** - Used for incorrect answers, resets.
- `--tj-error-color` (`#ef4444`)
- `--tj-error-light` (`#fef2f2`)

**Neutrals (Slate)** - Used for text, borders, subtle backgrounds.
- `--tj-text-main` (`#1e293b`)
- `--tj-text-muted` (`#64748b`)
- `--tj-bg-main` (`ghostwhite`) - Default background for the host wrapper.
- `--tj-bg-card` (`rgba(255, 255, 255, 0.95)`) - Used for glassmorphism.
- `--tj-bg-alt` (`#f8fafc`)
- `--tj-border-main` (`#e2e8f0`)

### Layout & Sizing

- **Border Radius**: `--tj-border-radius-sm`, `-md`, `-lg`, `-full`
- **Shadows**: `--tj-shadow-sm`, `-md`, `-glass`
- **Transitions**: `--tj-transition-fast`, `--tj-transition-normal`

## Shared Utility Classes

To keep component HTML DRY and uniform, use these standardized classes provided by `tj-shared.css`:

### .tj-card
Creates a container with a subtle glassmorphism effect, padding, border radius, and shadow. Ideal for individual questions, flashcards, or activity wrappers.

```html
<div class="tj-card">
  <h3 class="tj-h3">Question 1</h3>
  <p>Content goes here.</p>
</div>
```

### Buttons

- `.tj-btn` (Base class, required)
- `.tj-btn-primary` (Blue, for main actions like Submit, Next)
- `.tj-btn-secondary` (Gray/Outline, for secondary actions like Cancel, Skip)
- `.tj-btn-success` (Green)
- `.tj-btn-error` (Red)

```html
<button class="tj-btn tj-btn-primary">Continue</button>
<button class="tj-btn tj-btn-secondary">Skip</button>
```

### Icon Buttons
For circular buttons containing SVGs (like Play, Stop, Voice selection).

```html
<button class="tj-icon-btn">
  <svg>...</svg>
</button>
```

### Form Elements
- `.tj-input` (Standard text input with focus ring)

### UI Components

- `.tj-sticky-bar`: A horizontal bar that sticks to the top of the viewport (useful for progress or audio controls).
- `.tj-divider`: A dashed horizontal line that can optionally display text in the middle using `data-label="Title"`.
- `.tj-overlay`: A dark, blurred backdrop for modals and popups. Add the `.active` class to display it.

## Best Practices

1. **Avoid Setting Global Tag Styles**: Inside your component's custom `styles.css`, do NOT style bare HTML tags (like `div { ... }` or `p { ... }`). While Shadow DOM scopes it, it makes the code harder to read and specific overrides difficult. Use classes.
2. **Use Variables for Exceptions**: If a component needs a slightly different shade of blue for a very specific reason, use a local CSS variable derived from the master palette rather than hardcoding a hex value.
3. **Keep Host Clean**: The `:host` styling in the master CSS sets `background-color`, `font-family`, and `max-width`. Only override these in a specific component if absolutely necessary.
4. **Dark Mode Friendly**: Never hardcode colors like `white` or `#000` or `#fff` in any of your component CSS (`styles.css`). Always use the CSS variables defined in `tj-shared.css` (e.g. `var(--tj-bg-card)`, `var(--tj-text-main)`). The master stylesheet includes a `@media (prefers-color-scheme: dark)` block that automatically re-maps these variables to dark equivalents. If you hardcode colors, they will not flip in Dark Mode, breaking the UI.

## Mobile Layout Preferences

To maximize usable space on mobile devices (screens smaller than `sm` / 640px), follow the "edge-to-edge" pattern for main content containers:

1. **Remove Cards**: Switch `bg-white` to `bg-transparent` and remove `shadow` and `border`.
2. **Square Corners**: Set `rounded-none` to let content touch the screen edges.
3. **Tighten Padding**: Reduce horizontal padding (e.g., from `p-8` to `p-4`) so text remains readable without excessive whitespace.
4. **Maintain Headers**: Sticky bars or section headers can retain their background and bottom border to provide structural anchors.

Example using Tailwind:
```tsx
<section className="bg-transparent sm:bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-sm border-none sm:border">
  <div className="p-4 sm:p-8">
    {/* Content */}
  </div>
</section>
```
