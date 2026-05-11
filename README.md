# backdropi

Turn ordinary screenshots into polished mockups — right in the browser. No uploads to a server, no sign-ups, no watermarks.

## Features

- **Backgrounds** — solid color, gradient with 8-direction swatches + angle slider, image upload, or Unsplash search
- **Shadows** — 4 presets (Subtle, Soft, Deep, Dramatic) or full manual control over blur, opacity, offset, and color
- **Corner radius** — 3 presets + fine-tune slider (0–128px), independent padding control
- **Browser frame** — Safari-style window with traffic light dots, gradient chrome bar, centered URL bar
- **Export** — PNG or JPEG at 2× HiDPI resolution
- **Undo / Redo** — keyboard shortcuts (⌘Z, ⇧⌘Z / ⌘Y) and toolbar buttons
- **State persistence** — automatically saves to localStorage, restores on reload
- **Replace image** — upload a new screenshot at any time via toolbar or canvas hover button

## Stack

- [Vite](https://vitejs.dev)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) (icons)

## Getting started

```bash
npm install
```

Create a `.env` file in the project root with your [Unsplash API access key](https://unsplash.com/developers):

```
VITE_UNSPLASH_ACCESS_KEY=your_key_here
```

Then start the dev server:

```bash
npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## Usage

1. **Upload** — drag & drop a screenshot, click to browse, or paste from clipboard
2. **Customize** — open the tool palette to adjust background, shadow, corners, or switch to browser frame
3. **Export** — choose PNG or JPEG and download at 2× resolution
