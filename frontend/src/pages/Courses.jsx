
import { Link } from "react-router-dom";

const courses = [
  {
    number: "01",
    icon: "📚",
    title: "Arts & Science",
    description:
      "Explore arts, science, computer science, commerce and related degree programmes.",
    tags: ["B.Sc", "B.Com", "B.A"]
  },
  {
    number: "02",
    icon: "⚙️",
    title: "Engineering",
    description:
      "Discover engineering branches and technology-focused undergraduate programmes.",
    tags: ["B.E", "B.Tech", "AI & DS"]
  },
  {
    number: "03",
    icon: "🩺",
    title: "Medical",
    description:
      "Explore healthcare, nursing, pharmacy and allied health science study options.",
    tags: ["MBBS", "Nursing", "Allied Health"]
  }
];

export default function Courses() {
  return (
    <main className="page-section courses-section">
      <div className="courses-heading">
        <span className="section-label">FIND YOUR PATH</span>
        <h1 className="page-title">
          Explore Courses<span>.</span>
        </h1>
        <p className="page-description">
          Choose your study area to find colleges in your preferred location.
        </p>
      </div>

      <div className="course-grid">
        {courses.map((course) => (
          <article className="course-card" key={course.number}>
            <div className="course-card-top">
              <span className="course-icon">{course.icon}</span>
              <span className="course-number">{course.number}</span>
            </div>

            <h2>{course.title}</h2>
            <p>{course.description}</p>

            <div className="course-tags">
              {course.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <Link
              to={`/colleges?course=${encodeURIComponent(course.title)}`}
              className="course-link"
            >
              Choose Location <span>↗</span>
            </Link>
          </article>
        ))}
      </div>

      <div className="courses-cta">
        <div>
          <span className="section-label">NEED HELP CHOOSING?</span>
          <h2>Let's find the right direction for you.</h2>
        </div>
        <Link to="/contact" className="button-primary">
          Contact Us ↗
        </Link>
      </div>
    </main>
  );
}
