# Antigravity Prompt: Next.js React Three Fiber 3D Hero Component

Copy and paste the following prompt directly into Antigravity:

> You are a senior Next.js and WebGL developer. We are replacing the HTML5 canvas "code rain" background in the `ff360_labs` Next.js 14+ application with a high-end, interactive 3D WebGL hero section using React Three Fiber.
> 
> **Context:**
> The user will be providing a custom, procedurally generated `.glb` 3D asset (created via Python scripting in Blender). We need the Next.js component infrastructure to load, display, and interact with this model.
> 
> **Core Deliverables:**
> 
> **1. Setup & Dependencies:**
> Provide the exact `npm install` command required for `three`, `@react-three/fiber`, `@react-three/drei`, and their TypeScript types.
> 
> **2. The `Hero3D.tsx` Component:**
> Create a new client component (`"use client";`) that sets up a full-screen R3F `<Canvas>`.
> *   **Model Loading:** Use `useGLTF` from `@react-three/drei` to load a placeholder model from `/public/models/ff360_core.glb`.
> *   **Lighting & Environment:** The site has a deep black (`#0a0a0b`) and matte charcoal (`#17171a`) aesthetic. Configure dramatic, high-contrast lighting. Use a dim `ambientLight` and a strongly positioned `spotLight` with a metallic gold tint (`#c9a15a`) to illuminate the mechanical details of the 3D asset.
> *   **Interactivity:** Implement an interactive floating effect. Use the `useFrame` hook to slowly rotate the model on its Y-axis continuously. Additionally, read the user's mouse coordinates and use `THREE.MathUtils.lerp` to subtly tilt the model on the X and Z axes based on cursor position, giving it a heavy, responsive, tactile feel.
> *   **Suspense:** Wrap the model component in a React `<Suspense>` boundary. Use `Html` from `drei` to create a sleek, minimal loading state (e.g., "INITIALIZING 3D ENGINE...") utilizing the brand's `JetBrains Mono` font.
> 
> **3. Integration (`app/page.tsx`):**
> Show exactly how to import and absolutely position this `<Hero3D>` component behind the main typography in the Home page route, ensuring it is fully responsive and does not break the Tailwind CSS v4 layout.
> 
> Please output the complete, production-ready TypeScript code for `Hero3D.tsx` and the integration steps.
