export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center gap-6">
      <div
        className="w-8 h-8 rounded-full border-2 border-line-silver border-t-gold animate-spin motion-reduce:animate-none"
        role="status"
        aria-label="Loading"
      />
      <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-text-faint">
        Loading
      </p>
    </div>
  );
}
