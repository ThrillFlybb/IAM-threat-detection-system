import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";

export default function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const res = await registerUser(form);

    if (res.token) {
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <p className="guide">
          Register a new user to monitor login activity.
        </p>

        <input
          placeholder="Full Name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button className="register-btn" onClick={handleSubmit}>
          Register
        </button>

        <p style={{ marginTop: "20px" }}>
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}