import API_BASE_URL from "./config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function ResetPassword() {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    fetch(`${API_BASE_URL}/api/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Password reset failed");
        return res.text();
      })
      .then(msg => {
        setMessage(msg);
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch(err => setMessage(err.message));
  }

  return (
    <div className="form-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Registered Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="New Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <button type="submit">RESET PASSWORD</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ResetPassword;