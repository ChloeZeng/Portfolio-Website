import { useEffect, useRef, useState } from "react";

/*
  THREE-PHASE VIDEO SCROLLYTELLING
  ----------------------------------
  The .hero wrapper is 400vh tall, giving the user plenty of scroll
  distance. The .hero__sticky inner panel is position:sticky so the
  visuals stay pinned to the viewport while the user scrolls.

  Progress is calculated ONLY from this section's bounding rect —
  never from document height or window.scrollY / total page height.

  Phase A  0.00 – 0.12   intro-loop.mp4   autoplay, loop
  Phase B  0.12 – 0.88   main.mp4         scroll-scrubbed, no autoplay
  Phase C  0.88 – 1.00   ending-loop.mp4  autoplay, loop
*/

const PHASE_A_END = 0.16; // intro-loop → main
const PHASE_B_END = 0.72; // main → ending-loop

// Clamp a number between min and max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function Hero() {
  const heroStoryRef  = useRef(null); // the 400vh scroll container
  const introVideoRef = useRef(null); // intro-loop.mp4
  const mainVideoRef  = useRef(null); // main.mp4  (scroll-scrubbed)
  const endingVideoRef = useRef(null); // ending-loop.mp4

  const titleRef      = useRef(null);
  const subtitleRef   = useRef(null);
  const scrollHintRef = useRef(null);

  // Active phase drives which video has opacity 1.
  // Starts as "intro" so only intro-loop is visible before any scroll.
  const [activePhase, setActivePhase] = useState("intro");

  // Keep activePhase in a ref too so the RAF callback reads the
  // latest value without needing to be re-created every render.
  const activePhaseRef = useRef("intro");
  function setPhase(phase) {
    if (activePhaseRef.current !== phase) {
      activePhaseRef.current = phase;
      setActivePhase(phase); // triggers re-render for opacity
    }
  }

  // ── Entry animations for hero text ──────────────────────────────────────
  useEffect(() => {
    const els = [titleRef.current, subtitleRef.current, scrollHintRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(32px)";
      setTimeout(() => {
        el.style.transition = "opacity 1s ease, transform 1s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 300 + i * 200);
    });
  }, []);

  // ── Scroll-driven video sync ────────────────────────────────────────────
  useEffect(() => {
    let rafId = null;

    function syncFrame() {
      const section = heroStoryRef.current;
      const main    = mainVideoRef.current;

      if (section) {
        // Progress 0 = top of section aligned to viewport top
        // Progress 1 = bottom of section aligned to viewport bottom
        const rect          = section.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        const progress      = clamp(-rect.top / totalScrollable, 0, 1);

        if (progress < PHASE_A_END) {
          // ── Phase A: intro-loop ───────────────────────────────────────
          setPhase("intro");
          // Park main.mp4 at frame 0 (only if metadata is ready)
          if (main && main.readyState >= 1) {
            if (!main.paused) main.pause();
            main.currentTime = 0;
          }

        } else if (progress < PHASE_B_END) {
          // ── Phase B: main.mp4 scroll-scrubbed ────────────────────────
          setPhase("main");
          if (main && main.readyState >= 1 && main.duration) {
            // Map progress within Phase B → 0..duration
            const phaseProgress =
              (progress - PHASE_A_END) / (PHASE_B_END - PHASE_A_END);
            main.currentTime = phaseProgress * main.duration;
            if (!main.paused) main.pause(); // keep paused; we control time
          }

        } else {
          // ── Phase C: ending-loop ──────────────────────────────────────
          setPhase("ending");
          if (main && main.readyState >= 1 && main.duration) {
            main.currentTime = main.duration;
            if (!main.paused) main.pause();
          }
        }
      }

      rafId = requestAnimationFrame(syncFrame);
    }

    // Start the RAF immediately — no need to wait for metadata.
    // currentTime scrubbing just skips gracefully if readyState < 1.
    rafId = requestAnimationFrame(syncFrame);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []); // runs once on mount

  return (
    /*
      .hero  — 400vh tall; provides the scroll distance for all three phases.
      .hero__sticky — sticky panel that stays in the viewport while scrolling.
    */
    <section ref={heroStoryRef} className="hero">
      <div className="hero__sticky">

        {/*
          VIDEO LAYERS
          All three videos are stacked absolutely in the same position.
          Only the active phase has opacity 1; the rest are opacity 0.
          The CSS transition: opacity 0.45s on .hero__video handles crossfades.
          pointer-events: none on inactive videos prevents interaction leakage.
        */}

        {/* Phase A — intro-loop.mp4: plays on load, loops until scroll begins */}
        <video
          ref={introVideoRef}
          className="hero__video"
          src="/videos/intro-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{
            opacity: activePhase === "intro" ? 1 : 0,
            pointerEvents: activePhase === "intro" ? "auto" : "none",
          }}
        />

        {/* Phase B — main.mp4: scroll-scrubbed, never autoplays */}
        <video
          ref={mainVideoRef}
          className="hero__video"
          src="/videos/main.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{
            opacity: activePhase === "main" ? 1 : 0,
            pointerEvents: activePhase === "main" ? "auto" : "none",
          }}
        />

        {/* Phase C — ending-loop.mp4: loops after main sequence finishes */}
        <video
          ref={endingVideoRef}
          className="hero__video"
          src="/videos/ending-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{
            opacity: activePhase === "ending" ? 1 : 0,
            pointerEvents: activePhase === "ending" ? "auto" : "none",
          }}
        />

        {/* Dark gradient so hero text stays readable over any video */}
        <div className="hero__overlay" />

        {/* Hero copy — unchanged */}
        <div className="hero__content">
          <p className="hero__eyebrow">Portfolio — Product Design</p>
          <h1 className="hero__title" ref={titleRef}>
            I turn ambiguity into products people can actually use.
          </h1>
          <p className="hero__subtitle" ref={subtitleRef}>
            A product designer exploring interaction, systems, and code through
            live prototypes.
          </p>
        </div>

        <div className="hero__scroll-hint" ref={scrollHintRef}>
          <span className="hero__scroll-label">Scroll</span>
          <span className="hero__scroll-line" />
        </div>

      </div>
    </section>
  );
}

export default Hero;
