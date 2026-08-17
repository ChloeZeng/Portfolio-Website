import { useEffect, useRef, useState } from "react";

/*
  WORK CARD — compact project card, no large iframe.
  A small thumbnail placeholder sits at the top.
  Designed to be flexible enough for future design projects too.
*/

function WorkCard({ project, index }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Staggered fade-in when the gallery scrolls into view
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
      className={`work-card ${visible ? "work-card--visible" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="work-card__thumb">
  {project.image ? (
    <img
      src={project.image}
      alt={project.title}
      className="work-card__image"
    />
  ) : (
    <div className="work-card__thumb-inner">
      <span className="work-card__thumb-label">Live Project</span>
    </div>
  )}
</div>

      {/* Card body */}
      <div className="work-card__body">
        <span className="work-card__category">{project.category}</span>
        <h3 className="work-card__title">{project.title}</h3>
        <p className="work-card__desc">{project.description}</p>

        <div className="work-card__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="work-card__tag">{tag}</span>
          ))}
        </div>

        {/* CTA — always works even if thumbnail fails */}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="work-card__cta"
          >
            Open Live App ↗
          </a>
        )}
      </div>
    </article>
  );
}

export default WorkCard;
