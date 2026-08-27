# Antigravity Prompt: Responsive Scaling for Matter.js & React Three Fiber

Copy and paste the following prompt directly into Antigravity:

> You are a senior Next.js developer and Creative Technologist. We need to implement robust responsive scaling for the interactive components in the **ff360_labs** Next.js application, specifically targeting mobile and tablet viewports.
> 
> **Core Objective:**
> Update our existing `matter-js` (2D Physics) and `@react-three/fiber` (3D WebGL) components so they automatically and seamlessly adjust their boundaries, scale, and camera perspectives when the browser window resizes or when loaded on a mobile device.
> 
> **1. Matter.js Responsive Updates (Physics Canvases):**
> For all components using `matter-js` (e.g., the 404 Sandbox, Tech Stack Pit, Interactive Footer, Process Nodes):
> *   **Dynamic Canvas Resizing:** Add a `window.addEventListener('resize', handleResize)` inside the `useEffect` hook. The `handleResize` function must dynamically update the `render.bounds`, `render.options.width`, and `render.options.height` to match the new container dimensions.
> *   **Boundary Recalculation:** When the window resizes, use `Matter.Body.setPosition` and `Matter.Body.setVertices` to move and scale the static wall and floor bodies so the dynamic rigidbodies don't fall out of bounds or get trapped off-screen.
> *   **Mobile Scaling:** On viewports under `768px`, slightly reduce the initial scale of the rigidbodies (using `Matter.Body.scale`) so the scene doesn't feel cluttered on small screens.
> 
> **2. React Three Fiber Responsive Updates (`Hero3D.tsx`):**
> *   **Dynamic Camera FOV/Position:** Inside the `<Canvas>`, implement a custom component that utilizes the `useThree` hook to read the `viewport` and `size`. 
> *   If `size.width < 768` (mobile), pull the camera back on the Z-axis (e.g., `camera.position.z = 10` instead of `5`) or increase the FOV so the procedurally generated `.glb` model fits perfectly within the screen without clipping.
> *   Ensure the `useFrame` easing logic for mouse rotation scales down on touch devices, preventing erratic spinning when a user scrolls with their thumb.
> 
> Please output the exact updated boilerplate code for a responsive `PhysicsSandbox.tsx` and the updated responsive camera logic for `Hero3D.tsx`.
