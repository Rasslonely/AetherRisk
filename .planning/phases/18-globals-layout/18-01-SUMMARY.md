---
phase: 18-globals-layout
plan: 01
subsystem: ui-layout
tags: [globals-css, root-layout, typography, google-fonts, double-bezel, cyber-institutional, seo]

requires:
  - phase: 17-telemetry-navbar
    provides: "app/components/navbar.tsx"
provides:
  - "app/globals.css typography, custom keyframes, and Doppelrand design tokens"
  - "app/layout.tsx Root Layout with Google Fonts, SEO metadata, Navbar, and Footer"
  - "Verified production build compilation"
affects: [19-dashboard-page, 20-sandbox-page, 21-playwright-e2e]

actuals:
  tokens: 2800
  tasks: 2
  commits: 1

tech-stack:
  added: [app/globals.css, app/layout.tsx]
  patterns: [Cyber-Institutional Dark Theme, Double-Bezel Highlight Architecture, Ambient Lighting Mesh]

key-files:
  created: []
  modified:
    - app/globals.css
    - app/layout.tsx

key-decisions:
  - "Imported Plus Jakarta Sans (body/headers) and JetBrains Mono (cryptographic hashes/numbers)"
  - "Engineered ambient backdrop lighting layers with animate-ambient-breath keyframes"
  - "Configured comprehensive SEO and OpenGraph metadata targeting hackathon judges and risk officers"

patterns-established:
  - "Unified global design system shell with floating navigation and institutional pedigree footer"

requirements-completed:
  - LAYOUT-01

coverage:
  - id: D1
    description: "Design System Globals & Root Layout"
    requirement: "LAYOUT-01"
    verification:
      - kind: unit
        ref: "rtk pnpm build"
        status: pass
    human_judgment: false

duration: 3min
completed: 2026-08-28
status: complete
---

# Phase 18: Design System Globals & Root Layout Summary

**Upgraded `app/globals.css` and `app/layout.tsx` to establish an agency-tier cyber-institutional design system with premium typography, ambient lighting mesh, Doppelrand glassmorphism utilities, floating navigation, and institutional footer.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-08-28T19:06:35Z
- **Completed:** 2026-08-28T19:08:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- **`app/globals.css`** ([`app/globals.css`](file:///c:/Farras/Projects/Hackathon/AtherRisk/app/globals.css)):
  - Imported Google Fonts: **Plus Jakarta Sans** (clean geometric sans) and **JetBrains Mono** (precision monospace).
  - Configured OLED deep black base (`#020617` / `#000000`) and cyber neon variables (Cyan, Emerald, Red).
  - Defined custom keyframes: `@keyframes badgePulse`, `@keyframes scoreReveal`, and `@keyframes ambientBreath`.
  - Added Doppelrand inset shadow utilities and sleek custom scrollbars.
- **`app/layout.tsx`** ([`app/layout.tsx`](file:///c:/Farras/Projects/Hackathon/AtherRisk/app/layout.tsx)):
  - Comprehensive SEO, OpenGraph, and Twitter cards targeting hackathon judges and credit risk officers.
  - Ambient background glow aura layers with organic motion.
  - Embedded sticky floating `<Navbar />`.
  - Institutional protocol footer with credentials (*Creditcoin CC3, Gluwa Attestcoin, Phala TEE, ERC-4626*).
- Verified production build: `rtk pnpm build` passed with code 0.

## Files Modified

- `app/globals.css` - Global CSS tokens and animation keyframes.
- `app/layout.tsx` - Next.js 15 Root Layout shell.

## Decisions Made

- Utilized `JetBrains Mono` for cryptographic addresses and block numbers to give maximum technical credibility to Solidity calldata and hashes.

## Deviations from Plan

None - plan executed cleanly.

## Next Phase Readiness

- Ready for **Phase 19**: `Executive Pitch Dashboard Landing Page` (`app/page.tsx`).

---
*Phase: 18-globals-layout*
*Completed: 2026-08-28*
