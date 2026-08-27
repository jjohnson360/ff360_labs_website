"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <p className="font-mono text-sm tracking-[0.2em] uppercase text-gold mb-4">
        Something went wrong
      </p>
      <h1 className="font-display font-semibold text-4xl md:text-5xl text-text mb-6">
        An unexpected error occurred.
      </h1>
      <p className="text-text-dim text-sm max-w-md mb-10">
        The page hit a snag on the way in. Trying again often clears it
        {error.digest ? (
          <>
            {" "}
            — reference <span className="font-mono text-text-faint">{error.digest}</span>
          </>
        ) : null}
        .
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="font-mono text-xs tracking-widest uppercase py-4 px-8 rounded-sm transition-all duration-250 bg-gradient-to-br from-gold-dark via-gold-light to-gold text-[#14110a] font-semibold hover:brightness-110 hover:-translate-y-px"
      >
        Try again
      </button>
    </div>
  );
}
