import API_BASE_URL from "./config";
import { useState, useEffect } from "react";
import "./App.css";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim()
      })
    })
      .then(async res => {
        const text = await res.text();
        if (!res.ok) throw new Error(text);
        return text;
      })
      .then(() => {
        setMessage("User registered successfully. Please login.");
        setData({ name: "", email: "", password: "" });
      })
      .catch(err => {
        setMessage(err.message || "Registration failed");
      });
  }

  return (
    <div className="login-page">
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={data.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={data.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={data.password} onChange={handleChange} required />
          <button type="submit">REGISTER</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Register;