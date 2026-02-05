import { apiFetch } from "../api/api";

export function useAuth() {
  const signup = (payload) =>
    apiFetch("/auth/signup", "POST", payload);

  const verifyEmail = (payload) =>
    apiFetch("/auth/verify-email", "POST", payload);

  const login = async (payload) => {
    const user = await apiFetch("/auth/login", "POST", payload);
    return user;
  };

  const logout = async () => {
    await apiFetch("/auth/logout", "POST");
  };

  const getMe = async () => {
    return apiFetch("/auth/me");
  };


  return { signup, verifyEmail, login, logout, getMe };
}
