import { useEffect, useRef } from "react";

/*
  ENDING TRANSITION — ending-loop.mp4
  -------------------------------------
  A ~120vh visual beat between the scroll-controlled video and the
  project section. The video autoplays and loops — no scroll scrubbing.
  A closing line of copy reinforces the "building helps me think" theme.
*/

function EndingVideoTransition() {
  const textRef = useRef(null);

  // Reveal the text when this section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const el = textRef.current;
        if (el) {
          el.style.transition = "opacity 1.1s ease, transform 1.1s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    if (textRef.current) observer.observe(textRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="ending-transition">
      {/* ending-loop.mp4 — autoplays, loops, no scroll control */}
      <video
        className="ending-transition__video"
        src="/videos/ending-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="ending-transition__overlay" />

      <div className="ending-transition__content">
        <p
          ref={textRef}
          className="ending-transition__text"
          style={{ opacity: 0, transform: "translateY(32px)" }}
        >
          Building helps me move faster, think clearer, and validate how an
          experience actually feels.
        </p>
      </div>
    </section>
  );
}

export default EndingVideoTransition;
