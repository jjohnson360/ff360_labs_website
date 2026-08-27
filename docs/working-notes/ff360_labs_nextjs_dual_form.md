# Antigravity Prompt: Next.js Dual Form Submission (Formspree + Google Sheets CRM)

Copy and paste the following prompt directly into Antigravity:

> You are a senior Next.js developer. We need to create a client-side Contact Form component for the **ff360_labs** Next.js website that simultaneously submits data to two different endpoints:
> 1. **Formspree** (for email notifications)
> 2. **Google Apps Script** (to log the lead in our free Google Sheets CRM)
> 
> **Component Requirements (`components/ContactForm.jsx`):**
> *   Must include the `"use client";` directive at the top.
> *   Manage UI states for `isSubmitting`, `isSuccess`, and `isError` using React `useState`.
> *   Maintain the **ff360_labs** aesthetic (dark `#17171a` backgrounds, `#c9a15a` gold accents, clean borders).
> 
> **The `handleSubmit` Logic:**
> Instead of relying on a third-party library, write a custom `onSubmit` handler that prevents default submission and executes two asynchronous `fetch` requests.
> 
> *   **Request 1 (Formspree):**
>     *   Endpoint: `https://formspree.io/f/YOUR_FORM_ID`
>     *   Method: `POST`
>     *   Headers: `{'Accept': 'application/json'}`
>     *   Body: The form data.
> 
> *   **Request 2 (Google Sheets CRM):**
>     *   Endpoint: `https://script.google.com/macros/s/AKfycbw--UMsLREhksh2NW-WOqNl5UAft7E_uiEJcPm6MDpONgBFpCURi_teJvbPqrlsBYcDHQ/exec`
>     *   Method: `POST`
>     *   Body: The form data.
>     *   **CRITICAL:** You must include `mode: 'no-cors'` in the fetch options to bypass local browser security blocks. Because of `no-cors`, the response will be opaque, so do not attempt to parse it as JSON.
> 
> **Required Form Fields (ensure `name` attributes match exactly):**
> *   `business_name` (Text input)
> *   `email` (Email input)
> *   `budget` (Select dropdown)
> *   `project_purpose` (Textarea for project details)
> 
> **Success State:**
> If the submission is successful, hide the form and display a branded success message thanking the client.
> 
> Please generate the complete, self-contained Next.js React component code.
