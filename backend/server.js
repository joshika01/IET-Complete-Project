
import express from "express";
import cors from "cors";
import session from "express-session";
import { DatabaseSync } from "node:sqlite";
import { randomUUID, timingSafeEqual } from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.join(__dirname, "data");
fs.mkdirSync(dataDirectory, { recursive: true });

const db = new DatabaseSync(
  path.join(dataDirectory, "iet-applications.sqlite")
);

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    course TEXT NOT NULL,
    college_id TEXT,
    dob TEXT NOT NULL,
    community TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    father_occupation TEXT,
    mother_occupation TEXT,
    address TEXT NOT NULL,
    father_mobile TEXT NOT NULL,
    mother_mobile TEXT NOT NULL,
    student_mobile TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    register_number TEXT NOT NULL,
    plus_two_marks TEXT NOT NULL,
    tenth_marks TEXT NOT NULL,
    pincode TEXT NOT NULL,
    plus_two_department TEXT NOT NULL,
    last_school TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5175"
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json({ limit: "20kb" }));

// Local development session configuration.
// Use a persistent session store and HTTPS before production.
app.use(
  session({
    name: "iet_admin_session",
    secret: process.env.IET_SESSION_SECRET || randomUUID(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 30 * 60 * 1000
    }
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "IET API is running" });
});

// Existing student application submission route
app.post("/api/applications", (req, res) => {
  const body = req.body ?? {};

  const requiredFields = [
    "studentName", "course", "dob", "community",
    "fatherName", "motherName", "address",
    "fatherMobile", "motherMobile", "studentMobile",
    "whatsapp", "registerNumber", "plusTwoMarks",
    "tenthMarks", "pincode", "plusTwoDepartment",
    "lastSchool"
  ];

  const missingFields = requiredFields.filter(
    (field) =>
      typeof body[field] !== "string" ||
      body[field].trim() === ""
  );

  if (missingFields.length) {
    return res.status(400).json({
      error: "Please complete all required fields.",
      fields: missingFields
    });
  }

  const allowedCourses = [
    "Arts & Science",
    "Engineering",
    "Medical & Healthcare"
  ];

  if (!allowedCourses.includes(body.course)) {
    return res.status(400).json({ error: "Invalid course category." });
  }

  const textLimits = {
    studentName: 120,
    fatherName: 120,
    motherName: 120,
    address: 1000,
    fatherMobile: 20,
    motherMobile: 20,
    studentMobile: 20,
    whatsapp: 20,
    email: 254,
    registerNumber: 50,
    plusTwoMarks: 20,
    tenthMarks: 20,
    pincode: 10,
    plusTwoDepartment: 100,
    lastSchool: 200,
    fatherOccupation: 100,
    motherOccupation: 100,
    community: 50,
    dob: 10
  };

  for (const [field, maxLength] of Object.entries(textLimits)) {
    if (
      body[field] !== undefined &&
      (typeof body[field] !== "string" ||
        body[field].length > maxLength)
    ) {
      return res.status(400).json({
        error: `Invalid value for ${field}.`
      });
    }
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(body.dob) ||
    Number.isNaN(Date.parse(`${body.dob}T00:00:00Z`))
  ) {
    return res.status(400).json({
      error: "Please provide a valid date of birth."
    });
  }

  const id = `IET-${randomUUID().slice(0, 8).toUpperCase()}`;

  try {
    db.prepare(`
      INSERT INTO applications (
        id, student_name, course, college_id, dob, community,
        father_name, mother_name, father_occupation, mother_occupation,
        address, father_mobile, mother_mobile, student_mobile, whatsapp,
        email, register_number, plus_two_marks, tenth_marks, pincode,
        plus_two_department, last_school
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `).run(
      id,
      body.studentName.trim(),
      body.course,
      typeof body.collegeId === "string" ? body.collegeId : null,
      body.dob,
      body.community.trim(),
      body.fatherName.trim(),
      body.motherName.trim(),
      (body.fatherOccupation || "").trim(),
      (body.motherOccupation || "").trim(),
      body.address.trim(),
      body.fatherMobile.trim(),
      body.motherMobile.trim(),
      body.studentMobile.trim(),
      body.whatsapp.trim(),
      typeof body.email === "string" ? body.email.trim() : "",
      body.registerNumber.trim(),
      body.plusTwoMarks.trim(),
      body.tenthMarks.trim(),
      body.pincode.trim(),
      body.plusTwoDepartment.trim(),
      body.lastSchool.trim()
    );

    return res.status(201).json({
      message: "Application saved successfully.",
      referenceId: id
    });
  } catch (error) {
    console.error("Application database error:", error.message);
    return res.status(500).json({
      error: "Unable to save the application."
    });
  }
});

// Admin credentials must be configured in environment variables.
function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  return left.length === right.length &&
    timingSafeEqual(left, right);
}

function requireAdmin(req, res, next) {
  res.set("Cache-Control", "no-store");

  if (req.session?.adminAuthenticated !== true) {
    return res.status(401).json({ error: "Please log in as admin." });
  }

  next();
}

// Admin login
app.post("/api/admin/login", (req, res, next) => {
  res.set("Cache-Control", "no-store");

  const expectedUser = process.env.IET_ADMIN_USERNAME;
  const expectedPassword = process.env.IET_ADMIN_PASSWORD;
  const { username, password } = req.body ?? {};

  if (!expectedUser || !expectedPassword) {
    return res.status(503).json({
      error: "Admin login is not configured on the server."
    });
  }

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.length > 100 ||
    password.length > 200 ||
    !safeEqual(username, expectedUser) ||
    !safeEqual(password, expectedPassword)
  ) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  // Regenerate session ID after successful authentication.
  req.session.regenerate((error) => {
    if (error) return next(error);

    req.session.adminAuthenticated = true;

    req.session.save((saveError) => {
      if (saveError) return next(saveError);
      res.json({ message: "Admin login successful." });
    });
  });
});

// Get applications — admin only
app.get("/api/admin/applications", requireAdmin, (_req, res) => {
  try {
    const applications = db.prepare(`
      SELECT * FROM applications ORDER BY created_at DESC
    `).all();

    res.json({ applications });
  } catch (error) {
    console.error("Admin list error:", error.message);
    res.status(500).json({ error: "Unable to load applications." });
  }
});

// Update an application follow-up status — admin only
app.patch("/api/admin/applications/:id/status", requireAdmin, (req, res) => {
  const allowedStatuses = [
    "New",
    "Contacted",
    "In Progress",
    "Completed"
  ];

  const { status } = req.body ?? {};

  if (typeof status !== "string" || !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid application status." });
  }

  try {
    const result = db.prepare(`
      UPDATE applications SET status = ? WHERE id = ?
    `).run(status, req.params.id);

    if (Number(result.changes) === 0) {
      return res.status(404).json({ error: "Application not found." });
    }

    res.json({ message: "Application status updated.", status });
  } catch (error) {
    console.error("Status update error:", error.message);
    res.status(500).json({ error: "Unable to update status." });
  }
});

// Admin logout
app.post("/api/admin/logout", requireAdmin, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie("iet_admin_session", {
      httpOnly: true,
      sameSite: "strict",
      secure: false
    });

    res.json({ message: "Logged out successfully." });
  });
});

// Error handling
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON request." });
  }

  console.error("Server error:", error.message);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

app.listen(PORT, () => {
  console.log(`IET API running at http://localhost:${PORT}`);
  console.log(
    `Database file: ${path.join(dataDirectory, "iet-applications.sqlite")}`
  );
  console.log(
    process.env.IET_ADMIN_USERNAME && process.env.IET_ADMIN_PASSWORD
      ? "Admin credentials are configured."
      : "Admin login is disabled until credentials are configured."
  );
});
