import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AdminLoginProps {
  setAuth: (authState: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setAuth }) => {
  const [adminID, setAdminID] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          username: adminID,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      setAuth(true);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/admin");
    } catch (error) {
      console.log(error);
      alert("❌ ID หรือรหัสผ่านไม่ถูกต้อง!");
    }
  };

  return (
    <div id="admin-login">
      <form id="admin-login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <br />

        <label htmlFor="adminID">Admin ID:</label>
        <input
          type="text"
          id="adminID"
          placeholder="Enter Admin ID"
          value={adminID}
          onChange={(e) => setAdminID(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" id="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;