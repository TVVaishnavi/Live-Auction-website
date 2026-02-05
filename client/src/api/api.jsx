const BASE_URL = "http://localhost:3000/api";

export async function apiFetch(url, method = "GET", body) {
  const res = await fetch(BASE_URL + url, {
    method,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
