const API_BASE = "/api";
export async function adminLogin(username, password) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Admin login failed");
  }

  return data;
}

export async function getApplications() {
  const response = await fetch(`${API_BASE}/admin/applications`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not load applications");
  }

  return data;
}

export async function updateApplicationStatus(id, status) {
  const response = await fetch(
    `${API_BASE}/admin/applications/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not update status");
  }

  return data;
}

export async function adminLogout() {
  const response = await fetch(`${API_BASE}/admin/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Admin logout failed");
  }

  return data;
}
