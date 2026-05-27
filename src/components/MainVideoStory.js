import { useEffect, useRef } from "react";

/*
  MAIN VIDEO STORY — main.mp4
  ----------------------------
  This section is 360vh tall. The video stage is position:sticky so
  it pins to the viewport while the user scrolls through the section.

  Scroll progress is calculated ONLY from this section's bounding rect,
  never from the full document height.

  main.mp4 does NOT autoplay — its currentTime is driven entirely by
  scroll progress via requestAnimationFrame.
*/

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function MainVideoStory() {
  const sectionRef = useRef(null); // the 360vh scroll container
  const videoRef   = useRef(null); // main.mp4

  const headlineRef   = useRef(null);
  const supportRef    = useRef(null);

  // Fade in the text overlay when this section enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        [headlineRef.current, supportRef.current].forEach((el, i) => {
          if (!el) return;
          setTimeout(() => {
            el.style.transition = "opacity 1s ease, transform 1s ease";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, i * 180);
        });
        observer.disconnect();
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll-driven currentTime sync
  useEffect(() => {
    let rafId = null;

    function syncFrame() {
      const section = sectionRef.current;
      const video   = videoRef.current;

      if (section && video && video.readyState >= 1 && video.duration) {
        // Progress within THIS section only — 0 at top, 1 at bottom
        const rect            = section.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        const progress        = clamp(-rect.top / totalScrollable, 0, 1);

        // Map progress → video currentTime
        video.currentTime = progress * video.duration;

        // Keep paused — scroll controls time, not playback
        if (!video.paused) video.pause();
      }

      rafId = requestAnimationFrame(syncFrame);
    }

    rafId = requestAnimationFrame(syncFrame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    /* 360vh gives plenty of scroll distance for the full video scrub */
    <section ref={sectionRef} className="main-video-story">
      <div className="main-video-story__sticky">

        {/* main.mp4 — scroll-scrubbed, never autoplays */}
        <video
          ref={videoRef}
          className="main-video-story__video"
          src="/videos/main.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {/* Gradient so text stays readable */}
        <div className="main-video-story__overlay" />

        {/* Text overlay */}
        <div className="main-video-story__content">
          <p
            ref={headlineRef}
            className="main-video-story__headline"
            style={{ opacity: 0, transform: "translateY(32px)" }}
          >
            Not just designing screens, but making ideas feel real.
          </p>
          <p
            ref={supportRef}
            className="main-video-story__support"
            style={{ opacity: 0, transform: "translateY(24px)" }}
          >
            I build small apps and live prototypes to test ideas, interactions,
            and product direction.
          </p>
        </div>

      </div>
    </section>
  );
}

export default MainVideoStory;
