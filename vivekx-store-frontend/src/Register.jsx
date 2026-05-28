import API_BASE_URL from "./config";
import { useState } from "react";
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
        email: data.email.trim().toLowerCase(),
        password: data.password
      })
    })
      .then(async res => {
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error("Server returned an unexpected response. Please try again.");
        }

        if (!res.ok || json.success === false) {
          throw new Error(json.message || "Registration failed");
        }

        return json;
      })
      .then(() => {
        setMessage("✅ Registered successfully! Please log in.");
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