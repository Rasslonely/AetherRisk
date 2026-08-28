# Phase 18 Research: Design System Globals & Root Layout

## Objective
Elevate `app/globals.css` and `app/layout.tsx` into a $150k agency-tier cyber-institutional design system conforming strictly to our UI/UX and Motion doctrines (`high-end-visual-design`, `design-taste-frontend`, `motion-doctrine`).

## Design System Specifications

### 1. Typography & Aesthetic Doctrine
- **Banned**: Standard browser fonts (Roboto, Times, default sans).
- **Approved**: `Plus Jakarta Sans` or `Geist` for headers/body + `JetBrains Mono` for cryptographic hashes, block numbers, and calldata.
- **Background Texture**: OLED deep slate (`#020617` / `#030712`) with ambient radial mesh gradients (Cyan `rgba(6,182,212,0.12)`, Emerald `rgba(16,185,129,0.1)`, Purple `rgba(168,85,247,0.08)`).
- **Micro-Animations & Keyframes**:
  - `@keyframes badgePulse`: Subtle glowing pulsation
  - `@keyframes scoreReveal`: Smooth scale and luminance roll
  - `@keyframes ambientMesh`: Slow, organic backdrop aura breathing
  - Doppelrand inset shadows: `shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`

### 2. Root Layout
- Full SEO and OpenGraph metadata targeting hackathon judges and risk officers.
- Integrates `<Navbar />` with sticky floating pill geometry.
- Wraps all routes with consistent ambient glow, max-width bounds, and institutional footer with protocol credentials.

## Verification Gate
- `rtk pnpm build` compiles cleanly with zero errors.
