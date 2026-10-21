import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CollegeImage from "../components/CollegeImage";
import { collegeCategories, collegeLocations, colleges, filterColleges } from "../data/colleges";

export default function Colleges() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [course, setCourse] = useState(searchParams.get("course") || "");
  const matchingColleges = filterColleges(colleges, { location, category: course, query });
  const hasFilter = Boolean(location || query || course);

  return (
    <main className="page-section">
      <div className="courses-heading">
        <span className="section-label">FIND YOUR COLLEGE</span>
        <h1 className="page-title">Choose Your <span>College.</span></h1>
        <p className="page-description">{query ? <>Search results for: <strong>{query}</strong></> : <>Selected category: <strong>{course || "All Categories"}</strong></>}</p>
      </div>
      <section className="contact-card college-directory">
        <div className="college-filter-row">
          <label htmlFor="college-location">Preferred location
            <select id="college-location" value={location} onChange={(event) => setLocation(event.target.value)}>
              <option value="">All locations</option>
              {collegeLocations.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label htmlFor="college-category">Course category
            <select id="college-category" value={course} onChange={(event) => setCourse(event.target.value)}>
              <option value="">All categories</option>
              {collegeCategories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
        {!hasFilter && <p>Choose a location or category to explore the college directory.</p>}
        {hasFilter && <section aria-live="polite">
          <h2>{location ? `Colleges in ${location}` : "Matching colleges"}</h2>
          {matchingColleges.length > 0 ? <>
            <p className="page-description">{matchingColleges.length} college{matchingColleges.length !== 1 ? "s" : ""} found.</p>
            <div className="course-grid college-grid">{matchingColleges.map((college) => <article className="course-card college-card" key={college.id}>
              <CollegeImage college={college} />
              <span className="college-card-location">{college.location} · {college.category}</span>
              <h3>{college.name}</h3>
              <p className="college-card-address">{college.address}</p>
              <p className="college-card-courses"><strong>Programmes</strong><br />{college.courses.join(", ")}</p>
              <Link to={`/college/${college.id}`} className="button-primary college-details-link">View Details <span aria-hidden="true">→</span></Link>
            </article>)}</div>
          </> : <p>No matching colleges are currently listed. Try another course or location.</p>}
        </section>}
        <p style={{ marginTop: "24px" }}><Link to="/courses" className="text-link">← Back to Courses</Link></p>
      </section>
    </main>
  );
}
