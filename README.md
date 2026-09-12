# FrameShift Adaptive Layout Engine

FrameShift is a React and TypeScript editor for adapting editable advertisement layouts across multiple surfaces. The engine preserves semantic creative elements and visual definitions while repositioning and resizing them with constraint-aware archetypes.

## Features

- Editable logo, text, image, CTA, tagline, and feature elements
- Constraint-based layout adaptation with safe zones and collision handling
- Candidate generation, scoring, and traceable solver actions
- Premium Aurora Wireless Launch demo creative
- Responsive previews for social, video, and display surfaces
- Zustand editor state with Zod model validation

## Supported Surfaces

- Instagram Square: 1080 x 1080
- Instagram Story: 1080 x 1920
- YouTube Thumbnail: 1280 x 720
- Mobile Banner: 320 x 100
- Desktop Banner: 970 x 250

## Getting Started

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Scripts

```bash
npm run dev       # Start the Vite development server
npm test          # Run the Vitest suite
npm run build     # Type-check and create a production build
```

## Architecture

- `src/components/` contains the editor panels and shared advertisement renderer.
- `src/data/` contains the demo creative and target surface definitions.
- `src/engine/` contains normalization, archetypes, constraints, collision resolution, scoring, and trace generation.
- `src/store/` contains the Zustand editor state and adaptation flow.
- `src/styles.css` contains the editor theme and independent creative presentation styles.

The solver operates on full editable element objects. Archetypes primarily change geometry, while the shared renderer keeps each element's content, asset metadata, and visual treatment intact. Compact banner layouts may explicitly hide tertiary support elements when space is limited without removing them from the layout model.

## Development Notes

The demo product is represented as an editable image element with a CSS-rendered headphone treatment because the repository does not include a raster product asset. The image element still carries asset metadata and remains independently selectable and adaptable.
