import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useAuth } from "../hooks/useAuth";
import "../styles/VerifyEmail.css";

function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { resendOtp } = useAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem("verifyEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleVerify = async () => {
    try {
      await apiFetch("/auth/verify-email", "POST", { email, otp });
      localStorage.removeItem("verifyEmail");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await resendOtp({ email });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h2 className="verify-title">Verify Email</h2>
        <p className="verify-subtitle">
          Enter the OTP sent to your email
        </p>

        <div className="verify-form">
          <label>EMAIL ADDRESS</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>ONE TIME PASSWORD</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button onClick={handleVerify}>
            VERIFY EMAIL
          </button>
        </div>

        <button
          className="resend-btn"
          onClick={handleResend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;
