
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="page-section about-page">
      <section className="about-hero">
        <div className="about-content">
          <span className="section-label">ABOUT INDIA EDUCATIONAL TRUST</span>

          <h1 className="page-title">
            Guiding students towards a brighter future.
          </h1>

          <p className="page-description">
            Choosing the right course and college is an important
            step in every student's journey. Our website is designed
            to help students explore educational options and seek
            guidance for their next step.
          </p>

          <Link to="/contact" className="button-primary">
            Get in Touch ↗
          </Link>
        </div>

        <div className="about-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=85"
            alt="Students learning together on a college campus"
            className="about-image"
          />
        </div>
      </section>

      <section className="about-values">
        <div className="about-value-card">
          <span>01</span>
          <h2>Student Focus</h2>
          <p>
            Help students explore educational choices based on
            their interests and goals.
          </p>
        </div>

        <div className="about-value-card">
          <span>02</span>
          <h2>Course Discovery</h2>
          <p>
            Make it easier to learn about Arts & Science,
            Engineering and Medical study areas.
          </p>
        </div>

        <div className="about-value-card">
          <span>03</span>
          <h2>Guidance</h2>
          <p>
            Give students a clear way to contact the Trust
            for further educational guidance.
          </p>
        </div>
      </section>

      <section className="about-bottom">
        <h2>Your education journey starts with the right information.</h2>
        <Link to="/courses" className="button-secondary">
          Explore Courses →
        </Link>
      </section>
    </main>
  );
}
