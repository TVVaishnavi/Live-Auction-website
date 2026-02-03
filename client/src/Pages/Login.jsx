import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);

      localStorage.clear();
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      if (res.user.role === "HOST") navigate("/host");
      else if (res.user.role === "SELLER") navigate("/seller");
      else navigate("/");
    } catch (err) {
      if (err.message === "Email not verified") {
        localStorage.setItem("verifyEmail", form.email);
        navigate("/verify-email");
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">
          Sign in to continue bidding
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>PASSWORD</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">LOG IN</button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
