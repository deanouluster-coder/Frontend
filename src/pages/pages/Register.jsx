import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
        <button onClick={register} className="bg-yellow-500 text-white w-full py-2 rounded">Register</button>
      </div>
    </div>
  );
}
