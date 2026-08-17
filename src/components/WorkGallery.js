import { useEffect, useRef, useState } from "react";
import WorkCard from "./WorkCard";
import projects from "../data/projects";

/*
  WORK GALLERY — "Selected Work" chapter
  ----------------------------------------
  On desktop: three compact cards displayed in a clean grid row.
  On mobile: cards stack vertically.
  Cards stagger-reveal via IntersectionObserver as the section enters view.

  The gallery is intentionally not sticky-scrolled — with only three cards,
  a fixed horizontal gallery adds no meaningful travel distance and feels
  gimmicky. The HorizontalStory above already delivers the cinematic scroll
  experience. This section is a clean, editorial showcase.

  To add design projects later: push new objects into src/data/projects.js.
*/

function WorkGallery() {
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="work-gallery">
      {/* Chapter header */}
      <div
        ref={headerRef}
        className={`work-gallery__header ${headerVisible ? "reveal" : ""}`}
      >
        <span className="work-gallery__label">Selected Work</span>
        <h2 className="work-gallery__title">Designing Beyond Mockups</h2>
        <p className="work-gallery__subtitle">
          A growing collection of prototypes and product explorations.
        </p>
      </div>

      {/* Cards grid */}
      <div className="work-gallery__grid">
        {projects.map((project, i) => (
          <WorkCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

export default WorkGallery;
