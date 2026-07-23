# FF360 Labs - Studio Website

A premium, interactive digital studio portfolio built with Next.js, React Three Fiber, and Matter.js.

## Tech Stack
- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) / Drei
- **2D Physics:** [Matter.js](https://brm.io/matter-js/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Key Features
- **Interactive 3D Hero:** Mouse-reactive WebGL scenes using `useGLTF`.
- **Tactile Physics Sandboxes:** Interactive rigid and soft-body physics simulations across multiple pages (Tech Stack Pit, Floating Process Nodes, Interactive Footer).
- **Dynamic Custom Cursor:** A `framer-motion` spring-based cursor that shape-shifts its icon based on the active route.
- **Industrial Luxury Aesthetic:** A bespoke design system built on charcoal, silver, and metallic gold color tokens.

## Development

First, install dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure
- `src/app/`: Next.js App Router pages (`/services`, `/process`, `/pricing`, `/work`, `/contact`).
- `src/components/`: Reusable React components (Physics engines, 3D Canvas, UI layout).
- `public/`: Static assets (GLB models, images).
