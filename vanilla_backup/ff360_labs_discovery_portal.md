# Antigravity Prompt: ff360_labs Discovery Portal (Multi-Step Intake Form)

Copy and paste the following prompt directly into Antigravity:

> Please create a new standalone HTML file named `discovery.html` for the **ff360_labs** website. This page will serve as a private, client-facing Project Discovery Portal featuring a multi-step intake questionnaire.
> 
> The design must inherit the exact aesthetic from the main `index.html` file (dark mode, `#0a0a0b` background, `#c9a15a` gold accents, `Fraunces` and `Inter` fonts, `JetBrains Mono` kickers, and the blueprint grid background).
> 
> **Requirements for `discovery.html`:**
> 
> **1. Layout & Styling:**
> *   Keep the standard `ff360_labs` header and footer.
> *   Create a central card layout (`#17171a` background, subtle borders) to house the form.
> *   Include a dynamic visual progress bar at the top of the form indicating which step the user is on (e.g., Step 1 of 4).
> 
> **2. The Multi-Step Form (Vanilla JS):**
> *   Break the form down into 4 distinct `div` sections (steps) that transition smoothly.
> *   Write Vanilla JavaScript to handle the "Next" and "Previous" button clicks, hiding the inactive sections and displaying the active one without reloading the page.
> *   On the final step, the "Next" button should be a "Submit Project Request" button.
> 
> **3. Form Fields & Structure (Mapped to Formspree):**
> Ensure every input, select, and textarea has a unique `name` attribute so the data is captured correctly by Formspree.
> 
> *   **Step 1: The Basics**
>     *   Business/Organization Name (`input type="text"`)
>     *   Primary Contact Name (`input type="text"`)
>     *   Email (`input type="email"`)
>     *   Current Website URL (if any) (`input type="url"`)
> 
> *   **Step 2: Project Goals**
>     *   Main purpose of the website (Dropdown: Showcase, E-commerce, Leads, Booking, Other)
>     *   Who is your target audience? (`textarea`)
>     *   Desired visitor action (e.g., call, buy, book) (`input type="text"`)
> 
> *   **Step 3: Content & Design**
>     *   Pages needed (Checkboxes: Home, About, Services, Store, Blog, Contact, etc.)
>     *   Content Readiness (Radio: Have content, Need writing help, Mix of both)
>     *   Design Style (Dropdown: Clean/Minimal, Bold/Colorful, Luxury, Professional)
>     *   Link to 1 or 2 websites you like (`textarea`)
> 
> *   **Step 4: Tech & Timeline**
>     *   Do you own a domain? (`input type="text"`)
>     *   Ideal Launch Date (`input type="date"`)
>     *   Approximate Budget Range (Dropdown: $750-$1,500 Launch, $1,500-$3,000 Growth, Custom/Innovation)
> 
> **4. Form Integration:**
> *   Wrap the entire structure in a `<form>` tag.
> *   Use the Formspree action endpoint (you can leave an empty `action="https://formspree.io/f/YOUR_FORM_ID"` placeholder).
> 
> Please generate the complete, self-contained `discovery.html` code containing the HTML structure, the injected CSS for the multi-step transitions, and the necessary JavaScript logic.
