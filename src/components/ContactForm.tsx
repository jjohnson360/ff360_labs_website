"use client";

import { useForm, ValidationError } from "@formspree/react";

interface ContactFormProps {
  formId?: string;
}

export default function ContactForm({
  formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || "YOUR_FORM_ID",
}: ContactFormProps) {
  const [state, handleSubmit] = useForm(formId);

  if (state.succeeded) {
    return (
      <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-[#17171a] border border-[#c9a15a] rounded-lg">
        <svg className="w-12 h-12 stroke-[#c9a15a] mb-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 4L12 14.01l-3-3" />
        </svg>
        <h3 className="text-xl font-bold text-[#c9a15a] mb-2 font-mono uppercase tracking-wider">
          MESSAGE RECEIVED
        </h3>
        <p className="text-gray-300 text-sm max-w-sm">
          Thank you for reaching out. We will review your project details and respond shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg mx-auto w-full relative z-10">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs font-mono text-[#c9a15a] uppercase tracking-wider">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          placeholder="Jane Doe"
          className="p-3 bg-[#17171a] border border-gray-800 rounded text-white focus:border-[#c9a15a] outline-none transition-colors text-sm"
        />
        <ValidationError className="text-red-500 text-xs mt-1 font-mono" errors={state.errors} field="name" prefix="Name" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-mono text-[#c9a15a] uppercase tracking-wider">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          placeholder="jane@example.com"
          className="p-3 bg-[#17171a] border border-gray-800 rounded text-white focus:border-[#c9a15a] outline-none transition-colors text-sm"
        />
        <ValidationError className="text-red-500 text-xs mt-1 font-mono" errors={state.errors} field="email" prefix="Email" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-mono text-[#c9a15a] uppercase tracking-wider">
          Project Details
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about what you're building..."
          className="p-3 bg-[#17171a] border border-gray-800 rounded text-white focus:border-[#c9a15a] outline-none transition-colors text-sm resize-none"
        />
        <ValidationError className="text-red-500 text-xs mt-1 font-mono" errors={state.errors} field="message" prefix="Message" />
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className="mt-2 py-3 px-6 bg-[#c9a15a] text-[#0a0a0b] font-bold rounded hover:bg-[#d4af6e] transition-colors disabled:opacity-50 font-mono text-xs tracking-widest uppercase cursor-pointer"
      >
        {state.submitting ? "SENDING..." : "SUBMIT REQUEST"}
      </button>
    </form>
  );
}
