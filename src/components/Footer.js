import { useEffect, useRef, useState } from "react";

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

function Footer() {
  const [ref, visible] = useReveal(0.2);

  return (
    <footer className="footer">
      <div
        ref={ref}
        className={`footer__inner ${visible ? "reveal" : ""}`}
      >
        <div className="footer__closing">
          <h2 className="footer__closing-text">
            From ideas to execution — I design products that move from concept
            into something people can actually experience.
          </h2>
        </div>

        <div className="footer__bio-contact">
          <p className="footer__bio">
            Product designer with experience across social platforms, AI systems,
            emerging technologies, and front-end prototypes.
          </p>

          <nav className="footer__links">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              Resume
            </a>
            <a
              href="mailto:y0z04on@gmail.com"
              className="footer__link"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              LinkedIn
            </a>
          </nav>
        </div>

        <p className="footer__credit">© 2026 — Chloe Zeng</p>
      </div>
    </footer>
  );
}

export default Footer;
