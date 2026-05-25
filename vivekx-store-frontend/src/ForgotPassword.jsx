import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ added

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:0/api/users/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
      .then(res => {
        if (!res.ok) throw new Error("Email not registered");
        return res.text();
      })
      .then(msg => {
        setMessage(msg);

        // ✅ move to reset password page after verification
        setTimeout(() => {
          navigate("/reset-password");
        }, 1000);
      })
      .catch(err => setMessage(err.message));
  }

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter registered email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">VERIFY EMAIL</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ForgotPassword;