import { useEffect, useRef, useState } from "react";
import ProjectPreviewCard from "./ProjectPreviewCard";
import projects from "../data/projects";

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function CodeProjectSection() {
  const [transitionRef, transitionVisible] = useReveal(0.4);
  const [headingRef, headingVisible] = useReveal(0.3);

  return (
    <>
      {/* Transition beat */}
      <section className="transition-beat">
        <p
          ref={transitionRef}
          className={`transition-beat__text ${transitionVisible ? "reveal" : ""}`}
        >
          Not just designing screens — but making ideas feel real.
        </p>
      </section>

      {/* Main projects section */}
      <section className="projects-section">
        <div className="projects-section__header">
          <div
            ref={headingRef}
            className={`projects-section__heading-wrap ${headingVisible ? "reveal" : ""}`}
          >
            <span className="projects-section__label">Live Code Projects</span>
            <h2 className="projects-section__title">Designing Beyond Mockups</h2>
            <p className="projects-section__copy">
              I build small apps and live prototypes to test ideas, interactions,
              and product direction.
            </p>
            <p className="projects-section__support">
              Building helps me move faster, think clearer, and validate how an
              experience actually feels.
            </p>
          </div>
        </div>

        <div className="projects-section__grid">
          {projects.map((project, i) => (
            <ProjectPreviewCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}

export default CodeProjectSection;
