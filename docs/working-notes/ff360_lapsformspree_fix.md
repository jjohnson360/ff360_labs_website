# Antigravity Prompt: Fix Formspree Contact Form Integration

Copy and paste the following prompt directly into Antigravity:

> You are a senior Next.js developer. We need to fix the `/contact` page form in the **ff360_labs** Next.js 14+ application. The previous dual-submission logic (Formspree + Google Sheets fetch) caused silent payload failures and blocked email delivery. 
> 
> **Objective:**
> Completely replace the custom `fetch` submission logic in `components/ContactForm.jsx` (or `.tsx`) with Formspree's official `@formspree/react` library to ensure robust, error-checked email delivery.
> 
> **Tasks:**
> 
> **1. Install Dependency:**
> If not already present, run `npm install @formspree/react`.
> 
> **2. Refactor `ContactForm` Component:**
> Update the contact form component to use the `"use client";` directive and Formspree's `useForm` hook:
> 
> ```tsx
> "use client";

import { useForm, ValidationError } from '@formspree/react';

export default function ContactForm() {
  // Replace YOUR_FORM_ID with the actual 8-character Formspree hash
  const [state, handleSubmit] = useForm("YOUR_FORM_ID");

  if (state.succeeded) {
    return (
      <div className="text-center p-8 bg-[#17171a] border border-[#c9a15a] rounded-lg">
        <h3 className="text-xl font-bold text-[#c9a15a] mb-2 font-mono">MESSAGE RECEIVED</h3>
        <p className="text-gray-300">Thank you for reaching out. We will review your project details and respond shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto w-full">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-mono text-[#c9a15a]">Email Address</label>
        <input
          id="email"
          type="email" 
          name="email"
          required
          className="p-3 bg-[#17171a] border border-gray-800 rounded text-white focus:border-[#c9a15a] outline-none transition-colors"
        />
        <ValidationError className="text-red-500 text-xs mt-1" errors="{state.errors}" field="email" prefix="Email"/>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-mono text-[#c9a15a]">Project Details</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="p-3 bg-[#17171a] border border-gray-800 rounded text-white focus:border-[#c9a15a] outline-none transition-colors"
        />
        <ValidationError className="text-red-500 text-xs mt-1" errors="{state.errors}" field="message" prefix="Message"/>
      </div>

      <button 
        type="submit" 
        disabled={state.submitting}
        className="mt-2 py-3 px-6 bg-[#c9a15a] text-[#0a0a0b] font-bold rounded hover:bg-[#d4af6e] transition-colors disabled:opacity-50"
      >
        {state.submitting ? "SENDING..." : "SUBMIT REQUEST"}
      </button>
    </form>
  );
}