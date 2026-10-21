
import { useEffect, useState } from "react";
import {
  adminLogin,
  getApplications,
  updateApplicationStatus,
  adminLogout,
} from "../api";
import { colleges } from "../data/colleges";

const STATUSES = ["New", "Contacted", "In Progress", "Completed"];

const COLUMNS = [
  ["id", "Application ID"],
  ["student_name", "Student Name"],
  ["dob", "Date of Birth"],
  ["community", "Community"],
  ["father_name", "Father Name"],
  ["mother_name", "Mother Name"],
  ["father_occupation", "Father Occupation"],
  ["mother_occupation", "Mother Occupation"],
  ["father_mobile", "Father Mobile"],
  ["mother_mobile", "Mother Mobile"],
  ["student_mobile", "Student Mobile"],
  ["whatsapp", "WhatsApp"],
  ["email", "Email"],
  ["aadhaar_number", "Aadhaar Number"],
  ["address", "Address"],
  ["pincode", "Pincode"],
  ["course", "Course Category"],
  ["college_id", "College"],
  ["register_number", "+2 Register Number"],
  ["plus_two_marks", "+2 Total Marks"],
  ["tenth_marks", "10th Marks"],
  ["plus_two_department", "+2 Department"],
  ["last_school", "Last Studied School"],
  ["created_at", "Submitted At"],
];

function displayValue(value, key) {
  if (value == null || value === "") {
    return "—";
  }

  if (key === "aadhaar_number" || key === "aadhaarNumber") {
    const digits = String(value).replace(/\D/g, "");

    if (digits.length !== 12) {
      return "—";
    }

    return `XXXX-XXXX-${digits.slice(-4)}`;
  }

  return String(value);
}

function getCollegeName(collegeId) {
  if (!collegeId) return "—";

  const college = colleges.find(
    (item) => String(item.id) === String(collegeId)
  );

  return college?.name || String(collegeId);
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("ietadmin");
  const [password, setPassword] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadApplications() {
    setLoading(true);
    setError("");

    try {
      const data = await getApplications();

      const records = Array.isArray(data)
        ? data
        : data.applications ?? data.data ?? [];

      setApplications(records);
      setLoggedIn(true);
    } catch (err) {
      setLoggedIn(false);
      setError(err.message || "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await adminLogin(username, password);
      setPassword("");
      await loadApplications();
      setMessage("Login successful.");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(application, status) {
    setError("");
    setMessage("");

    try {
      await updateApplicationStatus(application.id, status);

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? { ...item, status }
            : item
        )
      );

      setMessage("Application status updated.");
    } catch (err) {
      setError(err.message || "Could not update status.");
    }
  }

  async function handleLogout() {
    setError("");
    setMessage("");

    try {
      await adminLogout();
      setLoggedIn(false);
      setApplications([]);
      setPassword("");
      setMessage("Logged out successfully.");
    } catch (err) {
      setError(err.message || "Logout failed.");
    }
  }

  if (!loggedIn) {
    return (
      <main className="admin-page">
        <section className="admin-panel">
          <p className="admin-eyebrow">
            INDIA EDUCATIONAL TRUST
          </p>

          <h1>Admin Login</h1>

          <p>
            Sign in to manage student admission enquiries.
          </p>

          {error && (
            <p role="alert" className="admin-error">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="admin-success">
              {message}
            </p>
          )}

          <form onSubmit={handleLogin} className="admin-form">
            <label htmlFor="admin-username">
              Username
            </label>

            <input
              id="admin-username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              autoComplete="username"
              required
            />

            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Sign In"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  const columns = COLUMNS;

  return (
    <main className="admin-page">
      <section className="admin-dashboard admin-spreadsheet">
        <div className="admin-dashboard-header">
          <div>
            <p className="admin-eyebrow">
              INDIA EDUCATIONAL TRUST
            </p>

            <h1>Student Applications</h1>

            <p>
              Excel-style view of all submitted student details.
            </p>
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>

        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="admin-success">
            {message}
          </p>
        )}

        <div className="admin-summary">
          <span>Total applications</span>
          <strong>{applications.length}</strong>
        </div>

        <div className="admin-sheet-toolbar">
          <span>All student fields</span>

          <button
            type="button"
            className="admin-refresh"
            onClick={loadApplications}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading && <p>Loading applications...</p>}

        {!loading && applications.length === 0 && (
          <p className="admin-empty">
            No applications found.
          </p>
        )}

        {applications.length > 0 && (
          <div className="admin-table-wrap admin-sheet-wrap">
            <table className="admin-table admin-sheet-table">
              <thead>
                <tr>
                  {columns.map(([key, label]) => (
                    <th key={key}>{label}</th>
                  ))}

                  <th>Follow-up Status</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    {columns.map(([key]) => (
                      <td key={key}>
                        {key === "college_id"
                          ? getCollegeName(application.college_id)
                          : displayValue(
                              application[key],
                              key
                            )}
                      </td>
                    ))}

                    <td>
                      <select
                        aria-label={`Status for ${application.id}`}
                        value={
                          STATUSES.includes(application.status)
                            ? application.status
                            : "New"
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            application,
                            event.target.value
                          )
                        }
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="admin-sheet-note">
          Aadhaar numbers are masked for privacy.
          Scroll horizontally to view every column.
        </p>
      </section>
    </main>
  );
}
