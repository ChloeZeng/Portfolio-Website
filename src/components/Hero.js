import { useEffect, useRef, useState } from "react";

/*
  VIDEO PHASE LOGIC
  -----------------
  The hero section is 300vh tall so the user scrolls through it
  while the sticky inner panel stays pinned on screen.

  Scroll progress 0 → 1 maps to three phases:

    Phase A  0.00 – 0.08   intro-loop.mp4  (loops, idle before scroll)
    Phase B  0.08 – 0.92   main.mp4        (scroll-controlled playback)
    Phase C  0.92 – 1.00   ending-loop.mp4 (loops, after main sequence)

  Crossfades between phases use 0.5s CSS opacity transitions.
*/

const PHASE_A_END  = 0.08;   // intro-loop → main
const PHASE_B_END  = 0.92;   // main → ending-loop

function Hero() {
  const sectionRef    = useRef(null); // outer 300vh scroll container
  const introVideoRef = useRef(null); // intro-loop.mp4
  const mainVideoRef  = useRef(null); // main.mp4
  const endingVideoRef= useRef(null); // ending-loop.mp4

  const titleRef      = useRef(null);
  const subtitleRef   = useRef(null);
  const scrollHintRef = useRef(null);

  // Which video is currently shown ("intro" | "main" | "ending")
  const [activePhase, setActivePhase] = useState("intro");

  // ── Entry animations for text ──────────────────────────────────────────
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

  // ── Scroll-driven video logic ───────────────────────────────────────────
  useEffect(() => {
    const mainVideo = mainVideoRef.current;
    let rafId = null;
    let lastProgress = -1;

    // Wait for main.mp4 metadata so we know its duration
    const handleMetadata = () => {
      startScrollSync();
    };

    if (mainVideo) {
      mainVideo.addEventListener("loadedmetadata", handleMetadata);
      // If already loaded (cached), kick off immediately
      if (mainVideo.readyState >= 1) handleMetadata();
    }

    function startScrollSync() {
      const update = () => {
        const section = sectionRef.current;
        if (!section) { rafId = requestAnimationFrame(update); return; }

        // progress = 0 at top of section, 1 when section has scrolled out
        const rect     = section.getBoundingClientRect();
        const total    = section.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        const progress = total > 0 ? Math.min(scrolled / total, 1) : 0;

        if (Math.abs(progress - lastProgress) > 0.0005) {
          lastProgress = progress;
          syncVideos(progress);
        }

        rafId = requestAnimationFrame(update);
      };
      rafId = requestAnimationFrame(update);
    }

    function syncVideos(progress) {
      const main = mainVideoRef.current;

      // ── Determine phase ─────────────────────────────────────────────────
      if (progress < PHASE_A_END) {
        setActivePhase("intro");
        // main.mp4: pause and park at frame 0 during intro phase
        if (main && !main.paused) main.pause();
        if (main && main.readyState >= 1) main.currentTime = 0;

      } else if (progress < PHASE_B_END) {
        setActivePhase("main");
        // Map progress within Phase B → main.mp4 currentTime
        const phaseProgress = (progress - PHASE_A_END) / (PHASE_B_END - PHASE_A_END);
        if (main && main.readyState >= 1 && main.duration) {
          main.currentTime = phaseProgress * main.duration;
        }
        // Keep paused — currentTime is driven by scroll, not playback
        if (main && !main.paused) main.pause();

      } else {
        setActivePhase("ending");
        // Park main at last frame when ending phase begins
        if (main && main.readyState >= 1 && main.duration) {
          main.currentTime = main.duration;
        }
        if (main && !main.paused) main.pause();
      }
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (mainVideo) mainVideo.removeEventListener("loadedmetadata", handleMetadata);
    };
  }, []);

  return (
    /*
      Outer section is 300vh tall — gives scroll distance for the sequence.
      Inner .hero__sticky pins the visible content to the viewport.
    */
    <section ref={sectionRef} className="hero">
      <div className="hero__sticky">

        {/* ── VIDEO LAYERS ──────────────────────────────────────────────
            All three videos are stacked absolutely.
            Only the active phase has opacity 1; others fade to 0.
            CSS transition: opacity 0.5s handles the crossfade.
        */}

        {/* Phase A: intro-loop.mp4 */}
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
          style={{ opacity: activePhase === "intro" ? 1 : 0 }}
        />

        {/* Phase B: main.mp4 — scroll controlled, does not autoplay */}
        <video
          ref={mainVideoRef}
          className="hero__video"
          src="/videos/main.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{ opacity: activePhase === "main" ? 1 : 0 }}
        />

        {/* Phase C: ending-loop.mp4 */}
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
          style={{ opacity: activePhase === "ending" ? 1 : 0 }}
        />

        {/* Gradient overlay — same as before, keeps text readable */}
        <div className="hero__overlay" />

        {/* Hero text — unchanged from original */}
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
