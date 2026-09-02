async function request(url, opts) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `So'rov xato: ${res.status}`);
  return data;
}

export const api = {
  listClasses: () => request("/api/classes"),
  createClass: (name, students) =>
    request("/api/classes", { method: "POST", body: JSON.stringify({ name, students }) }),
  getClass: (id) => request(`/api/classes/${id}`),
  updateClass: (id, patch) =>
    request(`/api/classes/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteClass: (id) => request(`/api/classes/${id}`, { method: "DELETE" }),
  toggleReason: (id, student, reasonId) =>
    request(`/api/classes/${id}/toggle`, {
      method: "POST",
      body: JSON.stringify({ student, reasonId }),
    }),
  finishLesson: (id) => request(`/api/classes/${id}/finish`, { method: "POST" }),
  getHistory: (id) => request(`/api/classes/${id}/history`),
  getMonthly: (id, month) => request(`/api/classes/${id}/monthly?month=${month}`),

  setupStatus: () => request("/api/auth/setup"),
  setupAdmin: (username, password) =>
    request("/api/auth/setup", { method: "POST", body: JSON.stringify({ username, password }) }),
  login: (username, password) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me"),

  listTeachers: () => request("/api/teachers"),
  createTeacher: (username, password) =>
    request("/api/teachers", { method: "POST", body: JSON.stringify({ username, password }) }),
};
