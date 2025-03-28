"use client";
import { useState } from "react";
import AdminPanel from "./AdminPanel"; // Import AdminPanel

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (data.success) {
      setAuthenticated(true);
    } else {
      alert(data.message);
    }
  };

  return authenticated ? (
    <AdminPanel />
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Admin Password"
        className="border p-2 rounded"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Login
      </button>
    </div>
  );
}
