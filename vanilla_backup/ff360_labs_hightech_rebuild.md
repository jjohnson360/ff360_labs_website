# Antigravity Prompt: ff360_labs High-Tech Site Rebuild

Copy and paste the following prompt directly into Antigravity:

> You are a senior frontend developer and UX motion designer. We are rebuilding the **ff360_labs** website to elevate it to a highly premium, high-tech aesthetic similar to 'wearly.store'. 
> 
> **Architectural Goal:**
> We are abandoning the single long-scroll design. The site must be separated into 5 distinct pages: `services.html` (default home), `process.html`, `pricing.html`, `work.html`, and `contact.html`. 
> However, the user experience must feel like a native high-tech app. Instead of hard browser reloads, you must implement a vanilla JavaScript page transition engine that fetches the next page's content and smoothly animates it into the DOM.
> 
> **Design Language (Industrial Luxury & High-Tech):**
> *   **Colors:** Deep black background (`#0a0a0b`), matte charcoal surfaces (`#17171a`), and metallic gold accents (`#c9a15a`).
> *   **Typography:** `Fraunces` for elegant headings, `Inter` for clean body text, `JetBrains Mono` for tech-style kickers/labels.
> *   **Vibe:** High-tech, futuristic but luxurious. Use animated grid lines, subtle glassmorphism, glowing accents, and smooth easing.
> 
> **Core Deliverables:**
> 
> **1. The Page Transition Engine (`transition.js` & `transition.css`):**
> *   Write a vanilla JavaScript router that intercepts clicks on the navigation links.
> *   Instead of loading a new page, it should trigger a high-tech transition animation (e.g., a dark overlay with a glowing gold grid that sweeps across the screen).
> *   While the overlay covers the screen, fetch the target HTML file, swap out the `<main>` tag's content, and update the browser URL using the History API.
> *   Animate the overlay out to reveal the new page.
> 
> **2. The Navigation & Shell:**
> *   Design a sleek, fixed navigation bar (glassmorphic, blurred background) with magnetic hover effects on the links: Services, Process, Pricing, Work, Contact.
> *   Include a custom high-tech mouse cursor (e.g., a minimal dot with a trailing glowing ring) that expands when hovering over clickable elements.
> 
> **3. The 5 Pages (HTML structure for each):**
> *   **`services.html`:** The entry point. A high-impact hero section with kinetic typography and a grid showcasing core capabilities (Branding, Web, AI, Assets).
> *   **`process.html`:** A step-by-step visual timeline of the studio's workflow, utilizing subtle scroll-triggered reveal animations.
> *   **`pricing.html`:** Sleek pricing cards mimicking high-end SaaS platforms. Matte dark backgrounds with glowing gold borders on hover.
> *   **`work.html`:** A dynamic portfolio gallery with a masonry layout and hover-reveal details.
> *   **`contact.html`:** A sleek contact page. **CRITICAL:** Ensure the form code strictly maintains the vanilla JavaScript `fetch` structure and `mode: 'no-cors'` setup designed to send data to the Google Apps Script endpoint (`https://script.google.com/macros/s/AKfycbw--UMsLREhksh2NW-WOqNl5UAft7E_uiEJcPm6MDpONgBFpCURi_teJvbPqrlsBYcDHQ/exec`).
> 
> **Output Requirements:**
> Please provide the complete HTML for all 5 pages, the centralized CSS file for the high-tech styling/animations, and the vanilla JS file handling the seamless page transitions and custom cursor.
