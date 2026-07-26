---
name: Hero SSR animation fix
description: Why CSS animations are used for hero content instead of framer-motion initial opacity-0
---

## Rule
Never use `initial={{ opacity: 0 }}` on framer-motion elements that are part of the primary hero content (badge, headline, subheadline, CTAs, stats). These are SSR-rendered and the screenshot/preview tool captures the page before JS runs, making content invisible.

**Why:** framer-motion renders `initial` state server-side as inline `style="opacity:0"`. The preview pane captures this before the animation plays, resulting in a blank-looking hero.

**How to apply:**
- Hero content uses CSS `@keyframes fadeInUp` via the `.animate-fade-in-up` utility class (defined in `src/app/globals.css`).
- Use `style={{ animationDelay: "Xms" }}` to stagger elements.
- Background decorative elements (orbs, particles, rings) can still use framer-motion `animate` with `repeat: Infinity` — they are `aria-hidden` and their initial visibility doesn't matter.
