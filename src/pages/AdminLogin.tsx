import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

// Define props for the component
interface AdminLoginProps {
  setAuth: (authState: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setAuth }) => {
  // Define state with TypeScript types
  const [adminID, setAdminID] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  // Handle login function with TypeScript type annotation
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔐 Check Admin ID and password (Example values)
    if (adminID === "admin" && password === "1234") {
      setAuth(true);
      localStorage.setItem("isAuthenticated", "true"); // Store login state
      navigate("/admin"); // Redirect to Admin Dashboard
    } else {
      alert("ID หรือรหัสผ่านไม่ถูกต้อง!");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Admin ID"
          value={adminID}
          onChange={(e) => setAdminID(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
