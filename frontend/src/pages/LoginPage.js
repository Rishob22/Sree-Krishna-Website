import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useStateContext } from "../context/StateContext";
import toast, { Toaster } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useStateContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    console.log("Login button clicked");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/user/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important to receive cookies
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok && data.success) {
        toast.success(data.message || "Login successful");
        //setUser(data.user); // Optional: update context
        navigate("/"); // Navigate after login
        window.location.reload();
      } else {
        toast.error(data.message || "Email or password incorrect");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <Toaster />
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
