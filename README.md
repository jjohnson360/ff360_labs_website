# ff360_labs Website

The official marketing website for **ff360_labs**, a creative technology studio based in Conway, Arkansas.
Built with Next.js (App Router), React Three Fiber, Framer Motion, and Tailwind CSS.

## Features

- **Next.js 14+ App Router**: Fast, server-rendered React application.
- **WebGL 3D Hero**: A custom 3D element built with `@react-three/fiber` and `@react-three/drei`. Features a fallback for devices with reduced motion enabled.
- **Glassmorphism UI**: Custom Tailwind configuration implementing a high-tech, industrial luxury aesthetic (deep blacks, metallic golds, and silvers).
- **Smooth Animations**: Scroll-linked reveals and micro-interactions powered by `framer-motion`.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D Engine**: [Three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Typography**: `next/font/google` (Fraunces, Inter, JetBrains Mono)

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the live site. The application will auto-reload as you make changes to the code.

## Project Structure

- `/src/app`: The Next.js App Router. Contains all page routes (`/`, `/services`, `/process`, `/pricing`, `/work`, `/contact`).
- `/src/components`: Reusable UI components like the `Header`, `Footer`, and `Hero3D` canvas.
- `/src/app/globals.css`: Contains the global Tailwind design tokens (e.g. `--gold`, `--silver`) and custom CSS utilities (e.g. `.glass-panel`, `.shimmer-text`).
- `/vanilla_backup`: An archive of the previous version of the site (HTML/CSS/JS).

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com). Simply link your GitHub repository to a new Vercel project, and it will automatically build and deploy.

```bash
npm run build
```

The build will generate a set of lightning-fast static pages.
