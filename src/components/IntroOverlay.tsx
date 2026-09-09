"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

/**
 * Full-screen cinematic intro that plays once per browser session on the home
 * page. The rendered HyperFrames sting (see `video/videos/ff360-labs-intro*`)
 * plays edge-to-edge; near the end an "Enter" button drifts in with a backlit
 * glow. Clicking it zooms the overlay past the viewport and fades it out,
 * revealing the site that has been sitting underneath the whole time.
 *
 * Reduced-motion: no video playback or zoom — the final poster frame shows with
 * the Enter button immediately, and dismissal is a plain fade.
 */

const SEEN_KEY = "ff360-intro-seen";
// When (in seconds) the Enter button fades in — just as the wordmark resolves.
const ENTER_AT = 15.2;

type Phase = "pending" | "playing" | "exiting" | "done";

export default function IntroOverlay() {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const reduceMotion = prefersReduced ?? false;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [{ phase, portrait }, setState] = useState<{
    phase: Phase;
    portrait: boolean;
  }>({ phase: "pending", portrait: false });
  const [showEnter, setShowEnter] = useState(false);

  const setPhase = useCallback(
    (p: Phase) => setState((s) => ({ ...s, phase: p })),
    [],
  );

  // Decide once, on mount, whether the intro runs at all. Needs the client
  // (sessionStorage + matchMedia), so it lives in an effect rather than a
  // render-time initializer.
  useEffect(() => {
    let next: Phase = "playing";
    let isPortrait = false;
    if (pathname !== "/") {
      next = "done";
    } else {
      try {
        if (sessionStorage.getItem(SEEN_KEY) === "1") next = "done";
      } catch {
        /* storage blocked — treat as not seen */
      }
      if (next === "playing") {
        isPortrait =
          window.matchMedia("(orientation: portrait)").matches ||
          window.innerWidth < 768;
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client init
    setState({ phase: next, portrait: isPortrait });
  }, [pathname]);

  // Reduced motion has no video to wait on — the button is available at once.
  const enterVisible = showEnter || (phase === "playing" && reduceMotion);

  // Hold the page still while the overlay is up.
  useEffect(() => {
    if (phase !== "playing" && phase !== "exiting") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  // Safety net: if the video stalls or autoplay is blocked, surface the button
  // anyway so the visitor is never trapped.
  useEffect(() => {
    if (phase !== "playing" || reduceMotion) return;
    const t = window.setTimeout(() => setShowEnter(true), 22000);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion]);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setPhase(reduceMotion ? "done" : "exiting");
  }, [reduceMotion, setPhase]);

  const skip = useCallback(() => {
    const v = videoRef.current;
    if (v && Number.isFinite(v.duration)) {
      v.currentTime = Math.max(v.currentTime, v.duration - 1.6);
    }
    setShowEnter(true);
  }, []);

  // Pre-mount / already-seen: paint a matching backdrop on the home route so the
  // site never flashes before the overlay resolves; nothing elsewhere.
  if (phase === "pending") {
    return pathname === "/" ? (
      <div className="fixed inset-0 z-[120] bg-[#060607]" aria-hidden />
    ) : null;
  }
  if (phase === "done") return null;

  const exiting = phase === "exiting";
  const base = portrait ? "/intro/intro-mobile" : "/intro/intro-desktop";

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#060607]"
      initial={false}
      animate={
        exiting
          ? reduceMotion
            ? { opacity: 0 }
            : { scale: 1.28, opacity: 0 }
          : { scale: 1, opacity: 1 }
      }
      transition={
        exiting
          ? {
              duration: reduceMotion ? 0.28 : 0.55,
              ease: reduceMotion ? "linear" : [0.7, 0, 0.84, 0],
            }
          : { duration: 0 }
      }
      onAnimationComplete={() => {
        if (exiting) setPhase("done");
      }}
      role="dialog"
      aria-label="Site intro"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={!reduceMotion}
        muted
        playsInline
        preload={reduceMotion ? "none" : "auto"}
        poster={`${base}-poster.jpg`}
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={(e) => {
          if (e.currentTarget.currentTime >= ENTER_AT) setShowEnter(true);
        }}
        onEnded={() => setShowEnter(true)}
      >
        <source src={`${base}.webm`} type="video/webm" />
        <source src={`${base}.mp4`} type="video/mp4" />
      </video>

      {/* keeps the button legible over any frame */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.55)_100%)]" />

      {/* gold bloom that rushes outward on exit */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(240,210,138,0.55), rgba(201,161,90,0.15) 45%, transparent 72%)",
          }}
          initial={{ opacity: 0, scale: 0.25 }}
          animate={
            exiting
              ? { opacity: [0, 0.85, 0], scale: 3.6 }
              : { opacity: 0, scale: 0.25 }
          }
          transition={{ duration: 0.55, ease: "easeIn" }}
        />
      )}

      {/* skip — only while the button hasn't arrived yet */}
      {!enterVisible && !reduceMotion && (
        <motion.button
          type="button"
          onClick={skip}
          className="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.3em] text-text-faint transition-colors hover:text-gold-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
        >
          Skip
        </motion.button>
      )}

      {/* Enter */}
      <motion.div
        className="absolute bottom-[13%] left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 26 }}
        animate={
          enterVisible && !exiting
            ? { opacity: 1, y: 0 }
            : exiting
              ? { opacity: 0, y: 0 }
              : { opacity: 0, y: 26 }
        }
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ pointerEvents: enterVisible && !exiting ? "auto" : "none" }}
      >
        <motion.button
          type="button"
          onClick={dismiss}
          aria-label="Enter the site"
          className="group relative flex items-center gap-3 rounded-full border border-gold/60 bg-[rgba(23,23,26,0.5)] px-9 py-4 font-mono text-sm uppercase tracking-[0.4em] text-text-main backdrop-blur-md"
          animate={
            reduceMotion || exiting
              ? { y: 0, boxShadow: "0 0 24px 0 rgba(201,161,90,0.25)" }
              : {
                  y: [0, -7, 0],
                  boxShadow: [
                    "0 0 22px 0 rgba(201,161,90,0.22)",
                    "0 0 48px 6px rgba(201,161,90,0.48)",
                    "0 0 22px 0 rgba(201,161,90,0.22)",
                  ],
                }
          }
          transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
          whileHover={{ scale: 1.05, borderColor: "rgba(240,210,138,0.95)" }}
          whileTap={{ scale: 0.96 }}
        >
          {/* backlight */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-70 blur-xl"
            style={{
              background:
                "linear-gradient(115deg, var(--gold-dark), var(--gold-light) 45%, var(--gold-dark))",
            }}
          />
          <span className="pl-[0.4em]">Enter</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
