import { useEffect, useRef } from "react";

/*
  INTRO HERO — intro-loop.mp4
  ----------------------------
  Simple full-screen opening section (~100vh).
  The video autoplays and loops. No scroll scrubbing here.
  Text animates in on load.
*/

function Hero() {
  const titleRef      = useRef(null);
  const subtitleRef   = useRef(null);
  const scrollHintRef = useRef(null);

  // Animate text in on mount
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

  return (
    <section className="hero">
      {/* intro-loop.mp4 — autoplays, loops, no scroll control */}
      <video
        className="hero__video"
        src="/videos/intro-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__eyebrow">Portfolio</p>
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
    </section>
  );
}

export default Hero;
