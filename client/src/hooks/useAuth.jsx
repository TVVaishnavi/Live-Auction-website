import { apiFetch } from "../api/api";

export function useAuth() {
  const signup = (payload) =>
    apiFetch("/auth/signup", "POST", payload);

  const verifyEmail = (payload) =>
    apiFetch("/auth/verify-email", "POST", payload);

  const login = async (payload) => {
    const data = await apiFetch("/auth/login", "POST", payload);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("LOGIN TOKEN:", data.token);
    return data;
  };

  const logout = () => localStorage.clear();

  return { signup, verifyEmail, login, logout };
}
