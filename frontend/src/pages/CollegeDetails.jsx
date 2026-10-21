
import { Link, useParams } from "react-router-dom";
import CollegeImage from "../components/CollegeImage";
import { colleges } from "../data/colleges";

export default function CollegeDetails() {
  const { id } = useParams();

  const college = colleges.find(
    (item) => String(item.id) === String(id)
  );

  if (!college) {
    return (
      <main className="college-details-page">
        <h1>College not found</h1>
        <Link to="/colleges" className="text-link">
          &larr; Back to Colleges
        </Link>
      </main>
    );
  }

  const categories = college.categories || [college.category];

  const courseQuery =
    college.category === "Medical"
      ? "Medical & Healthcare"
      : college.category;

  return (
    <main className="college-details-page">
      <Link to="/colleges" className="text-link college-back-link">
        &larr; Back to Colleges
      </Link>

      {/* Top banner with college image */}
      <header
        className="college-details-hero"
        style={{
          backgroundImage: college.image
            ? `linear-gradient(90deg, rgba(12, 35, 28, 0.88), rgba(12, 35, 28, 0.35)), url("${college.image}")`
            : "linear-gradient(135deg, #174d3a, #28765a)",
        }}
      >
        <div className="college-details-hero-content">
          <span className="college-details-eyebrow">
            EXPLORE YOUR FUTURE
          </span>

          <h1>{college.name}</h1>

          <p>
            <span aria-hidden="true">📍 </span>
            {college.location}
          </p>
        </div>
      </header>

      {/* Main college information */}
      <section className="college-details-content">
        {/* College photo */}
        <div className="college-details-photo-column">
          <CollegeImage
            college={college}
            className="college-detail-image-frame"
          />

          <div className="college-details-photo-caption">
            <span className="college-details-dot" />
            <span>College overview</span>
          </div>
        </div>

        {/* College details card */}
        <article className="contact-card college-details-card">
          <span className="section-label">COLLEGE DETAILS</span>

          <h2 className="college-details-name">{college.name}</h2>

          <div className="college-info-item">
            <span className="college-info-label">LOCATION</span>
            <p>{college.location || "Location not available"}</p>
          </div>

          <div className="college-info-item">
            <span className="college-info-label">CATEGORIES</span>

            <div className="college-category-list">
              {categories.filter(Boolean).map((category) => (
                <span
                  className="college-category-tag"
                  key={category}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="college-info-item">
            <span className="college-info-label">ADDRESS</span>
            <p>{college.address || "Address not available"}</p>
          </div>

          <div className="college-details-courses">
            <h3>Available study areas</h3>

            {college.courses?.length > 0 ? (
              <ul>
                {college.courses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            ) : (
              <p>Course information will be updated soon.</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="college-details-actions">
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="college-website-link"
              >
                Visit Official Website
                <span aria-hidden="true"> ↗</span>
              </a>
            )}

            <Link
              to={`/contact?college=${encodeURIComponent(
                college.id
              )}&course=${encodeURIComponent(courseQuery || "")}`}
              className="button-primary college-admission-button"
            >
              Apply for Admission
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
