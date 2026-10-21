
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { colleges } from "../data/colleges";

const API_URL = "http://localhost:3000/api";

const fields = [
  { name: "studentName", label: "Student Name", type: "text", required: true },
  { name: "dob", label: "Date of Birth", type: "date", required: true },
  { name: "fatherName", label: "Father's Name", type: "text", required: true },
  { name: "motherName", label: "Mother's Name", type: "text", required: true },
  { name: "fatherOccupation", label: "Father's Occupation", type: "text" },
  { name: "motherOccupation", label: "Mother's Occupation", type: "text" },
  { name: "fatherMobile", label: "Father's Mobile Number", type: "tel", required: true },
  { name: "motherMobile", label: "Mother's Mobile Number", type: "tel", required: true },
  { name: "studentMobile", label: "Student's Mobile Number", type: "tel", required: true },
  { name: "whatsapp", label: "WhatsApp Number", type: "tel", required: true },
  { name: "email", label: "Email Address", type: "email" },
  { name: "registerNumber", label: "+2 Register Number", type: "text", required: true },
  { name: "plusTwoMarks", label: "+2 Total Marks", type: "number", required: true },
  { name: "tenthMarks", label: "10th Mark / Percentage", type: "text", required: true },
  { name: "pincode", label: "Pincode", type: "text", required: true },
  { name: "plusTwoDepartment", label: "+2 Department", type: "text", required: true },
  { name: "lastSchool", label: "Last Studied School", type: "text", required: true }
];

const initialForm = {
  studentName: "",
  course: "",
  dob: "",
  community: "",
  aadhaarNumber: "",
  fatherName: "",
  motherName: "",
  fatherOccupation: "",
  motherOccupation: "",
  address: "",
  fatherMobile: "",
  motherMobile: "",
  studentMobile: "",
  whatsapp: "",
  email: "",
  registerNumber: "",
  plusTwoMarks: "",
  tenthMarks: "",
  pincode: "",
  plusTwoDepartment: "",
  lastSchool: ""
};

export default function Contact() {
  const [searchParams] = useSearchParams();

  const collegeId = searchParams.get("college") || "";
  const selectedCollege = colleges.find(
    (college) => college.id === collegeId
  );

  const selectedCourse =
    searchParams.get("course") ||
    selectedCollege?.category ||
    "";

  const [form, setForm] = useState({
    ...initialForm,
    course: selectedCourse
  });

  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "aadhaarNumber" && !/^\d{0,12}$/.test(value)) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          collegeId: selectedCollege?.id || null
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(
          result.error || "Unable to submit your application. Please try again."
        );
        return;
      }

      if (!result.referenceId) {
        setErrorMessage(
          "The server did not return an application reference ID."
        );
        return;
      }

      setReferenceId(result.referenceId);
      setSubmitted(true);
    } catch (error) {
      console.error("Application submission failed:", error);
      setErrorMessage(
        "Cannot connect to the server. Please check that the backend is running at localhost:3000."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="page-section">
        <section className="contact-card">
          <h1>Application Submitted Successfully!</h1>
          <p>Your application has been saved by the server.</p>

          <p>
            <strong>Reference ID:</strong> {referenceId}
          </p>

          <p>
            <strong>Selected College:</strong>{" "}
            {selectedCollege?.name || "Not specified"}
          </p>

          <p>Keep your reference ID for future enquiries.</p>

          <Link to="/courses" className="button-primary">
            Explore More Courses
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-section">
      <div className="courses-heading">
        <span className="section-label">ADMISSION ENQUIRY</span>

        <h1 className="page-title">
          Student Application<span>.</span>
        </h1>

        <p className="page-description">
          Complete the form below to submit your admission enquiry.
        </p>
      </div>

      <form className="contact-card" onSubmit={handleSubmit}>
        <h2>Course Details</h2>

        <div className="form-field">
          <label htmlFor="college">Selected College</label>
          <input
            id="college"
            value={selectedCollege?.name || "Not selected"}
            readOnly
          />
        </div>

        <div className="form-field">
          <label htmlFor="course">Course Category *</label>
          <select
            id="course"
            name="course"
            value={form.course}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Arts & Science">Arts & Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Medical & Healthcare">
              Medical & Healthcare
            </option>
          </select>
        </div>

        <h2>Student & Parent Details</h2>

        <div className="admission-form-grid">
          {fields.slice(0, 2).map((field) => (
            <div className="form-field" key={field.name}>
              <label htmlFor={field.name}>
                {field.label}{field.required ? " *" : ""}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                required={Boolean(field.required)}
              />
            </div>
          ))}

          <div className="form-field">
            <label htmlFor="community">Community *</label>
            <select
              id="community"
              name="community"
              value={form.community}
              onChange={handleChange}
              required
            >
              <option value="">Select community</option>
              <option value="OC">OC</option>
              <option value="BC">BC</option>
              <option value="BCM">BCM</option>
              <option value="MBC/DNC">MBC / DNC</option>
              <option value="SC">SC</option>
              <option value="SCA">SCA</option>
              <option value="ST">ST</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="aadhaarNumber">
              Aadhaar Number (Optional)
            </label>
            <input
              id="aadhaarNumber"
              name="aadhaarNumber"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={12}
              pattern="[0-9]{12}"
              placeholder="Enter 12 digits only"
              value={form.aadhaarNumber}
              onChange={handleChange}
              aria-describedby="aadhaar-note"
            />
            
          </div>

          {fields.slice(2).map((field) => (
            <div className="form-field" key={field.name}>
              <label htmlFor={field.name}>
                {field.label}{field.required ? " *" : ""}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                required={Boolean(field.required)}
                min={field.name === "plusTwoMarks" ? 0 : undefined}
              />
            </div>
          ))}

          <div className="form-field full-width">
            <label htmlFor="address">Full Address *</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <p className="form-note">
          Please use fictional details while testing this demo.
          Only submit real student information after the system's
          security and privacy protections are ready.
        </p>

        {errorMessage && (
          <p role="alert" className="form-note">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="button-primary"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Application →"}
        </button>
      </form>
    </main>
  );
}
