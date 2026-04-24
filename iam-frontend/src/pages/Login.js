import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

export default function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const res = await loginUser(form);

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
        <h2>Login</h2>

        <p className="guide">
          Enter your credentials to access the dashboard.
        </p>

        <input
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button className="login-btn" onClick={handleSubmit}>
          Login
        </button>

        <p style={{ marginTop: "20px" }}>
          New user?{" "}
          <span className="link" onClick={() => navigate("/register")}>
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}