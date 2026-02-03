import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signup(form);
      localStorage.setItem("verifyEmail", form.email);
      navigate("/verify-email");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">
          Join our exclusive bidding community
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>FULL NAME</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>EMAIL ADDRESS</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>PASSWORD</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>ROLE</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select role</option>
            <option value="SELLER">Seller</option>
            <option value="BIDDER">Bidder</option>
          </select>

          <button type="submit" onClick={handleSubmit}>CREATE ACCOUNT</button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log in</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
