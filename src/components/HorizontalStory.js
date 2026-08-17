import { useEffect, useRef } from "react";

/*
  HORIZONTAL STORY — panel-based, each panel owns its video
  ----------------------------------------------------------
  The outer section (.horizontal-story) is 350vh tall, giving the
  user enough scroll distance to move through all three panels.

  The sticky viewport stays pinned to the screen. Inside it, a
  300vw horizontal track holds three 100vw panels. Vertical scroll
  progress drives the track's translateX, so it feels like moving
  across three distinct cinematic scenes.

  Each panel is self-contained:
    Panel 1  intro-loop.mp4   autoplay, loop
    Panel 2  main.mp4         autoplay, loop  (V1 — simple, stable)
    Panel 3  ending-loop.mp4  autoplay, loop

  On mobile (≤768px) the JS translate is skipped and CSS stacks
  the panels vertically so they read as normal full-screen sections.
*/

const PANELS = [
  {
    video: "/videos/intro-loop.mp4",
    eyebrow: "Portfolio",
    title: "I turn ambiguity into products people can actually use.",
    subtitle:
      "A product designer exploring interaction, systems, and code through live prototypes.",
  },
  {
    video: "/videos/main.mp4",
    title: "Not just designing screens — but making ideas feel real.",
    subtitle:
      "I build small apps and live prototypes to test ideas, interactions, and product direction.",
  },
  {
    video: "/videos/ending-loop.mp4",
    title:
      "Building helps me move faster, think clearer, and validate how an experience actually feels.",
    subtitle:
      "From concept to interaction, I use prototypes to understand what works before the idea becomes final.",
  },
];

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function HorizontalStory() {
  const sectionRef = useRef(null); // outer 350vh container
  const trackRef   = useRef(null); // 300vw horizontal flex track

  useEffect(() => {
    let rafId;

    function tick() {
      const section = sectionRef.current;
      const track   = trackRef.current;

      if (section && track) {
        // Progress = 0 when section top meets viewport top,
        // progress = 1 when section bottom meets viewport bottom.
        const rect            = section.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        const progress        = clamp(-rect.top / totalScrollable, 0, 1);

        // Only translate on desktop — mobile stacks vertically via CSS
        if (window.innerWidth > 768) {
          const maxTranslate = track.scrollWidth - window.innerWidth;
          track.style.transform = `translateX(${-progress * maxTranslate}px)`;
        } else {
          track.style.transform = "none";
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section ref={sectionRef} className="horizontal-story">
      <div className="horizontal-story__sticky">
        <div ref={trackRef} className="horizontal-story__track">

          {PANELS.map((panel, i) => (
            <div key={i} className="story-panel">

              {/* Each panel has its own full-cover video background */}
              <video
                className="story-panel__video"
                src={panel.video}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
              />

              {/* Per-panel gradient overlay for text readability */}
              <div className="story-panel__overlay" />

              {/* Text — bottom-left, editorial style */}
              <div className="story-panel__content">
                {panel.eyebrow && (
                  <p className="story-panel__eyebrow">{panel.eyebrow}</p>
                )}
                <h2 className="story-panel__title">{panel.title}</h2>
                <p className="story-panel__subtitle">{panel.subtitle}</p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default HorizontalStory;
