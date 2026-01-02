import { useState } from "react";
import { saveToken } from "../utils/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const register = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        saveToken(data.token);
        window.location.href = "/";
      } else setMsg(data.message || "Registration failed");
    } catch (err) {
      setMsg("Server error");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={register}
          className="bg-gray-800 text-white w-full py-2 rounded hover:bg-gray-900 transition"
        >
          Register
        </button>
        {msg && <p className="text-center text-sm mt-2">{msg}</p>}
      </div>
    </div>
  );
}
