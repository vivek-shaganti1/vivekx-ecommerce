import API_BASE_URL from "./config";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email.trim(),
        password: data.password.trim()
      })
    })
      .then(async res => {
        const text = await res.text();
        if (!res.ok) throw new Error(text || "Login failed");
        return JSON.parse(text);
      })
      .then(user => {
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("auth-change"));
        navigate("/home");
      })
      .catch(err => setMessage(err.message));
  }

  return (
    <div className="login-page">
      <div className="form-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            required
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Reveal password"}
            >
              🔪
            </span>
          </div>

          <button type="submit">LOGIN</button>
        </form>

        <Link className="forgot-link" to="/forgot">
          Forgot password?
        </Link>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;