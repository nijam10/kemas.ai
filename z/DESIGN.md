# Kemas.ai Design System

## 🎨 Visual Identity

Kemas.ai uses an **Editorial Warm Cream** aesthetic that conveys premium quality, warmth, and Indonesian cultural authenticity.

---

## Color Palette

### Primary Colors
```css
--brand-bg: #FCFBF7          /* Warm Cream - Main background */
--brand-surface: #FFFFFF      /* Pure White - Cards, surfaces */
--brand-surface-alt: #F3F2EE  /* Light Warm Gray - Alternate surfaces */
```

### Accent Colors
```css
--brand-accent: #F97316       /* Kemas Orange - Primary CTA, highlights */
--brand-accent-dark: #ea580c  /* Dark Orange - Hover states */
--brand-gold: #FACC15         /* Gold - Secondary accent, premium feel */
```

### Text Colors
```css
--brand-text: #1A1A1A         /* Near Black - Primary text */
--brand-muted: #737373        /* Gray - Secondary text, captions */
```

### Border & Dividers
```css
--brand-border: #E5E4E0       /* Warm Gray - Borders, dividers */
```

---

## Typography

### Font Families
```css
--font-display: 'Plus Jakarta Sans'  /* Headings, display text */
--font-body: 'Inter'                 /* Body text, UI elements */
--font-serif: ui-serif               /* Editorial headlines */
```

### Font Sizes
```css
/* Display */
--text-7xl: 4.5rem    /* 72px - Hero headlines */
--text-6xl: 3.75rem   /* 60px - Section headlines */
--text-5xl: 3rem      /* 48px - Page titles */

/* Headings */
--text-4xl: 2.25rem   /* 36px - H1 */
--text-3xl: 1.875rem  /* 30px - H2 */
--text-2xl: 1.5rem    /* 24px - H3 */
--text-xl: 1.25rem    /* 20px - H4 */
--text-lg: 1.125rem   /* 18px - H5 */

/* Body */
--text-base: 1rem     /* 16px - Body text */
--text-sm: 0.875rem   /* 14px - Small text */
--text-xs: 0.75rem    /* 12px - Captions */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

---

## Spacing

### Scale
```css
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
```

---

## Border Radius

```css
--radius-sm: 0.5rem    /* 8px - Small elements */
--radius-md: 0.75rem   /* 12px - Cards, inputs */
--radius-lg: 1rem      /* 16px - Large cards */
--radius-xl: 1.5rem    /* 24px - Feature cards */
--radius-2xl: 2rem     /* 32px - Hero sections */
--radius-full: 9999px  /* Fully rounded - Pills, badges */
```

---

## Shadows

### Elevation
```css
/* Soft shadow for cards */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Medium shadow for hover states */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Large shadow for modals, dropdowns */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Extra large shadow for floating elements */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## Components

### Navbar
```css
Background: rgba(252, 251, 247, 0.8)  /* Warm cream with transparency */
Backdrop: blur(12px)                   /* Glass effect */
Border: 1px solid #E5E4E0              /* Thin warm border */
Shadow: 0 1px 3px rgba(0, 0, 0, 0.05) /* Soft shadow */
Height: 72px                           /* Desktop */
Height: 64px                           /* Mobile */
Position: sticky top-0                 /* Sticky on scroll */
Z-index: 50                            /* Above content */
```

**Navbar Items:**
- Font: Inter, 14px, medium weight
- Color: #737373 (default), #1A1A1A (hover/active)
- Spacing: 32px between items
- Transition: 200ms ease

**CTA Button:**
- Background: #F97316 (Kemas Orange)
- Text: White, 14px, semibold
- Padding: 12px 24px
- Border radius: 9999px (fully rounded)
- Hover: #ea580c (darker orange)
- Shadow: 0 2px 4px rgba(249, 115, 22, 0.2)

### Footer
```css
Background: #1A1A1A                    /* Near black */
Text: #FCFBF7                          /* Warm cream */
Border top: 1px solid #27272a          /* Subtle divider */
Padding: 64px 24px 32px                /* Generous spacing */
```

**Footer Links:**
- Color: #a1a1aa (muted)
- Hover: #FCFBF7 (warm cream)
- Font: Inter, 14px
- Transition: 200ms ease

### Cards
```css
Background: #FFFFFF                    /* Pure white */
Border: 1px solid #E5E4E0              /* Warm border */
Border radius: 24px                    /* Rounded corners */
Padding: 32px                          /* Generous padding */
Shadow: 0 1px 3px rgba(0, 0, 0, 0.05) /* Soft shadow */
Hover shadow: 0 4px 6px rgba(0, 0, 0, 0.1) /* Elevated on hover */
Transition: 300ms ease                 /* Smooth animation */
```

### Buttons

**Primary Button:**
```css
Background: #F97316                    /* Kemas Orange */
Text: #FFFFFF                          /* White */
Padding: 16px 32px                     /* Comfortable touch target */
Border radius: 9999px                  /* Fully rounded */
Font: Inter, 16px, semibold
Shadow: 0 2px 4px rgba(249, 115, 22, 0.2)
Hover: #ea580c                         /* Darker orange */
Hover shadow: 0 4px 8px rgba(249, 115, 22, 0.3)
```

**Secondary Button:**
```css
Background: transparent
Text: #1A1A1A                          /* Near black */
Border: 1px solid #E5E4E0              /* Warm border */
Padding: 16px 32px
Border radius: 9999px
Font: Inter, 16px, medium
Hover background: #FFFFFF              /* White on hover */
Hover border: #F97316                  /* Orange border on hover */
```

### Inputs
```css
Background: #FFFFFF                    /* White */
Border: 2px solid #E5E4E0              /* Warm border */
Border radius: 12px                    /* Rounded */
Padding: 12px 16px                     /* Comfortable */
Font: Inter, 16px
Color: #1A1A1A                         /* Near black */
Placeholder: #737373                   /* Gray */
Focus border: #F97316                  /* Orange on focus */
Focus ring: 0 0 0 3px rgba(249, 115, 22, 0.1)
Transition: 200ms ease
```

### Badges
```css
Background: rgba(249, 115, 22, 0.1)   /* Light orange tint */
Text: #F97316                          /* Kemas Orange */
Padding: 6px 12px
Border radius: 9999px                  /* Fully rounded */
Font: Inter, 12px, medium
```

---

## Animations

### Transitions
```css
--transition-fast: 150ms ease
--transition-base: 200ms ease
--transition-slow: 300ms ease
```

### Hover Effects
- **Cards:** Lift up 4px, increase shadow
- **Buttons:** Darken background, increase shadow
- **Links:** Change color, underline

### Page Transitions
- **Fade in:** opacity 0 → 1, 300ms
- **Slide up:** translateY(20px) → 0, 400ms
- **Stagger:** Delay each child by 100ms

---

## Responsive Breakpoints

```css
--screen-sm: 640px    /* Mobile landscape */
--screen-md: 768px    /* Tablet */
--screen-lg: 1024px   /* Desktop */
--screen-xl: 1280px   /* Large desktop */
--screen-2xl: 1536px  /* Extra large */
```

---

## Layout

### Container
```css
Max width: 1280px                      /* Desktop */
Padding: 24px                          /* Mobile */
Padding: 48px                          /* Desktop */
Margin: 0 auto                         /* Centered */
```

### Grid
```css
Columns: 1                             /* Mobile */
Columns: 2                             /* Tablet */
Columns: 3                             /* Desktop */
Gap: 24px                              /* Standard spacing */
```

---

## Accessibility

### Focus States
```css
Outline: 2px solid #F97316             /* Orange outline */
Outline offset: 2px                    /* Space from element */
```

### Color Contrast
- All text meets WCAG AA standards
- Minimum contrast ratio: 4.5:1 for body text
- Minimum contrast ratio: 3:1 for large text

### Interactive Elements
- Minimum touch target: 44x44px
- Clear hover/focus states
- Keyboard navigable

---

## Usage Guidelines

### Do's ✅
- Use warm cream background for main pages
- Use white for cards and elevated surfaces
- Use Kemas Orange for primary actions
- Use thin borders and soft shadows
- Maintain generous spacing
- Use rounded corners consistently
- Ensure smooth transitions

### Don'ts ❌
- Don't use harsh black backgrounds (except footer)
- Don't use bright, saturated colors
- Don't use heavy shadows
- Don't use sharp corners on interactive elements
- Don't overcrowd the interface
- Don't use inconsistent spacing

---

## Brand Voice

### Tone
- **Professional** yet approachable
- **Premium** without being pretentious
- **Helpful** and supportive
- **Indonesian-focused** and culturally aware

### Language
- Clear and concise
- Avoid jargon
- Use "you" to address users
- Emphasize benefits over features

---

**This design system ensures Kemas.ai maintains a consistent, premium, and culturally-relevant visual identity across all touchpoints.**
