import { useState } from "react";

/** Displays a college photo only when its catalogue record provides a verified source. */
export default function CollegeImage({ college, className = "college-image-frame", hero = false }) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(college.image) && !failed;

  return (
    <div className={`${className}${hasImage ? " has-image" : " is-placeholder"}`}>
      {hasImage ? (
        <img
          className={hero ? "college-hero-image" : className === "college-detail-image-frame" ? "college-detail-image" : "college-image"}
          src={college.image}
          alt={`${college.name} campus`}
          loading={hero ? "eager" : "lazy"}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="college-image-placeholder" role="img" aria-label={`${college.name} campus photo unavailable`}>
          <span className="college-placeholder-mark" aria-hidden="true">IET</span>
          <span>Campus photo unavailable</span>
        </div>
      )}
    </div>
  );
}
