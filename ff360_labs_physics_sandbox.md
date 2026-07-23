# Antigravity Prompt: Next.js Matter.js Physics Sandbox Component

Copy and paste the following prompt directly into Antigravity:

> You are a senior Next.js developer and Creative Technologist. We are building an interactive 2D physics sandbox for the **ff360_labs** Next.js 14+ application to serve as a highly engaging "easter egg" (e.g., for the 404 page or the footer of the `/process` timeline).
> 
> **Core Objective:**
> Create a React client component (`PhysicsSandbox.tsx`) using the `matter-js` library. The sandbox will feature rigidbodies consisting of scattered, deconstructed elements of the "ff360_labs" logo that the user can pick up, throw, and stack using their mouse.
> 
> **Deliverables:**
> 
> **1. Setup & Dependencies:**
> Provide the `npm install` command for `matter-js`, `poly-decomp` (if needed for complex shapes), and their TypeScript types.
> 
> **2. The `PhysicsSandbox.tsx` Component:**
> Write a robust `"use client";` component that initializes the Matter.js engine inside a `useRef` and `useEffect` hook.
> *   **Environment Boundaries:** Calculate the width and height of the parent container to create static physical walls and a floor so objects cannot fall out of view. Handle window resize events gracefully to update the boundary walls.
> *   **The Logo Rigidbodies:** Programmatically generate dynamic bodies representing the letters/shapes of "ff360_labs". 
>     *   Use a mix of rectangles, circles, or custom SVG paths for the characters (`f`, `f`, `3`, `6`, `0`, `_`, `l`, `a`, `b`, `s`).
>     *   Style the renderer so the bodies match the studio's industrial luxury aesthetic: matte charcoal fills (`#17171a`) with metallic gold wireframes or borders (`#c9a15a`).
> *   **Physical Properties:** Adjust the `restitution` (bounciness), `friction`, and `density` of the logo elements so they feel heavy and mechanical rather than light and floaty.
> *   **Mouse Interaction:** Implement `MouseConstraint` tied to the React canvas reference. This allows the user's cursor to grab, drag, and throw the logo pieces around the screen.
> *   **Memory Management:** **CRITICAL:** Next.js hot-reloading and React strict mode can cause duplicate engines. Ensure you write a clean return function inside the `useEffect` to properly stop the runner, clear the engine, and remove the canvas on unmount to prevent memory leaks.
> 
> **3. Integration Steps:**
> Show how to import this component dynamically (`next/dynamic` with `ssr: false`) into a `not-found.tsx` page, ensuring it takes up the full viewport height.
> 
> Please output the complete, production-ready TypeScript code and integration instructions.
