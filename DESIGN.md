# Design System Strategy: High-End Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Academic Curator."** 

This system moves beyond the typical service-organization aesthetic by adopting a high-end editorial approach. We are not building a dashboard; we are crafting a digital publication that feels as prestigious as a physical alumni journal. 

To break the "template" look, we utilize **intentional asymmetry**. Layouts should leverage generous whitespace (using our `20` and `24` spacing tokens) to allow content to breathe. Overlapping elements—such as a glassmorphic card partially obscuring a large `display-lg` headline—create a sense of physical depth and sophisticated layering. This high-contrast interplay between massive typography and delicate, semi-transparent surfaces defines the signature look.

---

## 2. Colors & Surface Philosophy
The palette is anchored in the heritage of Navy Blue and Gold, but executed through a modern Material Design lens to provide tonal depth.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts or tonal transitions.
- Use `surface` (#f8f9fa) for the main background.
- Use `surface_container_low` (#f3f4f5) for secondary sections.
- This creates "soft" boundaries that feel more organic and premium than rigid lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface_container` tiers to "nest" importance:
- **Base:** `surface`
- **Sectioning:** `surface_container_low`
- **Component Backgrounds:** `surface_container_lowest` (White) to create a subtle lift against the off-white background.

### The "Glass & Gold" Rule
To elevate the brand beyond flat navy blue:
- **Glass Surfaces:** For floating navigation or modal overlays, use a semi-transparent `primary` (#001e40 at 80% opacity) or `surface_container_lowest` (White at 70% opacity) with a `backdrop-blur` of 20px.
- **Signature Textures:** Apply subtle linear gradients transitioning from `primary` (#001e40) to `primary_container` (#003366) on hero backgrounds. Main CTAs should use the `secondary_container` (Gold) to pop against the deep navy.

---

## 3. Typography
We utilize **Plus Jakarta Sans** for its geometric clarity and modern "ink traps," which provide an editorial edge.

*   **Display (lg, md):** Use for high-impact hero statements. Set with tight letter-spacing (-0.02em) to mimic premium magazine mastheads.
*   **Headline (lg, md, sm):** Used for section starts. These should often be paired with a `label-md` "kicker" in uppercase Gold (`secondary`) above the headline to establish a clear hierarchy.
*   **Title (lg, md, sm):** Used for card titles and navigational elements. Bold weights are preferred here to maintain authority.
*   **Body (lg, md):** Optimized for readability. Use `body-lg` for introductory paragraphs and `body-md` for standard content.
*   **Labels:** Reserved for captions and small UI metadata.

---

## 4. Elevation & Depth
Hierarchy is achieved through **Tonal Layering** rather than traditional structural lines.

### The Layering Principle
Stacking tiers creates natural lift. For example, a `surface_container_lowest` card placed on a `surface_container_low` background creates a soft, sophisticated edge without a single drop shadow.

### Ambient Shadows
When a component must float (like a FAB or a Glassmorphic Menu):
- **Blur:** 40px to 60px.
- **Opacity:** 4%-8%.
- **Color:** Use a tinted shadow (`on_surface` at low opacity) to ensure the shadow feels like a natural obstruction of light, never a "grey glow."

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., in high-contrast modes), use a **Ghost Border**: `outline_variant` (#c3c6d1) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons
- **Primary:** `secondary_container` (Gold) background with `on_secondary_container` text. Roundedness: `full`.
- **Secondary (Glass):** Semi-transparent `primary` background with `on_primary` text and `backdrop-blur`.
- **Tertiary:** No background; `primary` text with an icon.

### Cards & Lists
- **Rule:** Forbid divider lines. Use `spacing.6` (2rem) of vertical whitespace to separate items.
- **Card Style:** Use `rounded-xl` (1.5rem) and `surface_container_lowest` (Pure White).

### Input Fields
- **Style:** Background-filled using `surface_container_high`. No borders. 
- **States:** On focus, transition the background to `surface_container_highest` and add a 2px "Ghost Border" in Gold (`secondary`).

### Glass Modals
- **Specs:** Background: `primary` at 80% opacity; Backdrop-blur: 16px; Roundedness: `xl`. This creates a high-end "frost" that keeps the user grounded in the previous context.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical margins. If a container is 12 columns, consider an 8-column text block offset to the right.
- **Do** use "Gold" (`secondary`) sparingly as an accent—it is the "jewelry" of the design, not the fabric.
- **Do** lean into the `ROUND_TWELVE` (0.75rem - 1rem) corners for a friendly yet professional feel.

### Don't
- **Don't** use 1px dividers or "boxes." Let the background color shifts do the heavy lifting.
- **Don't** use standard black for text. Always use `on_surface` (#191c1d) or `on_background` to maintain a softer, high-end feel.
- **Don't** crowd the interface. If it feels busy, increase the spacing token by two levels (e.g., move from `8` to `12`).