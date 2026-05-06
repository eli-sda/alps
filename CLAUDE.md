# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn                   # install dependencies
yarn storybook         # dev server at http://localhost:9001 (hot reload)
yarn build             # build library with Rollup → dist/cjs and dist/esm
yarn build-storybook   # static storybook build → .storybook-build/
yarn test              # run tests (react-scripts test)
yarn update-styles     # update ALPS CDN styles via scripts/update-styles.js
```

To run a single test file:
```bash
yarn test --testPathPattern=src/atoms/button
```

## Architecture

This is **alps-library**, a React component library implementing the [ALPS design system](https://alps.adventist.io/v3/) for the Seventh-day Adventist Church. It is built with Rollup and documented/developed via Storybook.

### Component structure (Atomic Design)

```
src/
  atoms/          # Primitive components: Button, Icon, Image, Text, Grid, Video, etc.
  molecules/      # Composed components: blocks, forms, navigation, media, store, etc.
  organisms/      # Page-level sections: Header, Footer, content areas, asides, etc.
  global/         # Shared configuration constants: colors.tsx, commons.tsx, grids.tsx, etc.
  helpers/        # Utility hooks and functions: useClasses, useToggle, usePagination, etc.
  index.ts        # Public API — only explicitly exported components are available to consumers
```

### Class naming conventions

Components produce ALPS CSS class names following a BEM-like convention with ALPS prefixes:
- `o-*` — objects/components (e.g. `o-button`, `o-icon`)
- `u-theme--{color}` — theme color variants (e.g. `u-theme--ming`, `u-theme--denim`)
- `u-*` — utility classes (e.g. `u-color--base`, `u-background-color--white`)
- `can-be--*` — contextual dark/light mode hints

The ALPS CSS is not bundled — it must be loaded separately (versioned files are in `cdn/`).

### Key helpers

- **`useClasses(base, conditionals, extra)`** (`src/helpers/useClasses.tsx`) — the standard utility for building component class strings from a base class, a conditionals object (key = class, value = boolean), and optional extras. Used throughout all components.
- **`src/global/colors.tsx`** — defines all primary theme colors, grayscale colors, and class name helpers.
- **`src/global/commons.tsx`** — defines `ComponentsStatus`, `ComponentsTypes`, `getBaseClass`, and other shared utilities.

### Build

The Rollup config (`rollup.config.js`) walks `src/` and bundles all `.tsx` files except:
- `*.stories.tsx` — Storybook stories (excluded from dist)
- `src/global/` — configuration constants (excluded from dist)
- `src/atoms/icons/library/` — raw icon SVGs (excluded from dist)

Output: `dist/cjs` (CommonJS) and `dist/esm` (ES modules).

### Storybook

Stories live alongside their components as `ComponentName.stories.tsx`. The Storybook preview uses `storybook-addon-themes` to switch between ALPS color themes at runtime. Default theme is Ming. Story order: Introduction → Documentation → Atoms → Molecules → Organisms.

Storybook is deployed to Cloudflare Pages from the `storybook` branch via GitHub Actions.

### Adding a new component

1. Create the component in the appropriate atomic layer (`atoms/`, `molecules/`, or `organisms/`).
2. Use `useClasses` for class name composition.
3. Add a `ComponentName.stories.tsx` alongside it.
4. Export it from `src/index.ts`.
