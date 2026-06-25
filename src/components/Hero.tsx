"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icons";

export function Hero() {
  const reduce = useReducedMotion();
  // When reduced motion is requested, render text at its final position (no fade/slide)
  // and don't autoplay the background video.
  const reveal = (offset: { opacity: number; y: number }) =>
    reduce ? false : offset;

  return (
    <section
      className="relative overflow-hidden bg-night bg-cover bg-center text-paper"
      style={{ backgroundImage: "url('/images/hero-fenceline.jpg')" }}
    >
      {/* Background video; falls back to the hero photo (poster) if it can't play.
          Autoplay is disabled when the visitor prefers reduced motion. */}
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero-fenceline.jpg"
        aria-hidden
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      {/* Darkening overlay so text stays readable over the video/photo */}
      <div className="pointer-events-none absolute inset-0 bg-night/55" />
      {/* warm golden-hour wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange/15 via-transparent to-night/30" />
      <div className="pointer-events-none absolute inset-0 grid-texture opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-sand" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-40 sm:pt-28 sm:pb-48">
        <motion.span
          initial={reveal({ opacity: 0, y: 12 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="eyebrow inline-flex items-center gap-2 border-l-4 border-orange pl-3 text-xs text-hazard"
        >
          A Texas Data Center Investigation
        </motion.span>

        <motion.h1
          initial={reveal({ opacity: 0, y: 18 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-5 max-w-3xl text-balance text-4xl font-bold leading-[1.03] sm:text-6xl"
        >
          They&apos;re draining Texas dry.
          <span className="block text-orange">It&apos;s your water.</span>
          <span className="block text-orange">It&apos;s your air.</span>
          <span className="block text-orange">It&apos;s your land.</span>
          <span className="block text-orange">Fight to keep it.</span>
        </motion.h1>

        <motion.p
          initial={reveal({ opacity: 0, y: 18 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85"
        >
          Billion-dollar data centers are pumping Texas aquifers dry, fouling the air with diesel
          exhaust, and crushing property values with round-the-clock noise. We document who&apos;s
          doing it, where — and what landowners can do about it.
        </motion.p>

        <motion.div
          initial={reveal({ opacity: 0, y: 18 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 rounded-sm bg-orange px-5 py-3 font-bold text-paper transition-transform hover:-translate-y-0.5"
          >
            See what&apos;s happening near you
            <Icon name="arrow" width={18} height={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
