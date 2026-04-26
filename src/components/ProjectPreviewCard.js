import { useEffect, useRef, useState } from "react";

function ProjectPreviewCard({ project, index }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className={`project-card ${visible ? "project-card--visible" : ""}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Browser-style mockup frame */}
      <div className="project-card__browser">
        <div className="project-card__browser-bar">
          <span className="browser-dot browser-dot--red" />
          <span className="browser-dot browser-dot--yellow" />
          <span className="browser-dot browser-dot--green" />
          <span className="browser-dot browser-dot--spacer" />
          <span className="browser-url">{project.url}</span>
        </div>
        <div className="project-card__iframe-wrap">
          {!iframeError ? (
            <iframe
              src={project.url}
              title={project.title}
              className="project-card__iframe"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms"
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="project-card__iframe-fallback">
              <p>Preview unavailable</p>
              <p className="project-card__iframe-fallback-hint">
                Open the live app to see it in action.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Card meta */}
      <div className="project-card__meta">
        <div className="project-card__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-card__tag">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__cta"
        >
          Open Live App ↗
        </a>
      </div>
    </article>
  );
}

export default ProjectPreviewCard;
