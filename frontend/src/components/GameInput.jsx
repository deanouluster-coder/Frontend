import { useState } from "react";
import { useState } from "react";
import { getToken } from "../utils/auth";

export default function GameInput({ onSuccess }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (code.length !== 3) return setMsg("Enter exactly 3 digits");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/play/guess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ code })
      });
      const data = await res.json();

      setMsg(data.message || "Played!");
      if (data.success && onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setMsg("Error connecting to server");
    }

    setCode("");
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md mt-4">
      <input
        className="border p-2 w-full mb-2 text-center text-xl"
        maxLength={3}
        placeholder="Enter 3-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
      />
      <button
        onClick={submit}
        className="bg-yellow-500 text-white w-full py-2 rounded font-bold hover:bg-yellow-600 transition"
      >
        Play
      </button>
      {msg && <p className="text-center mt-2 text-sm">{msg}</p>}
    </div>
  );
}
export default function GameInput({ demoPlayers, setDemoPlayers }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const submit = () => {
    if (code.length !== 3) return setMsg("Enter exactly 3 digits");

    // Randomly pick a zero
    const zeroNumber = Math.floor(Math.random() * 9) + 1;
    setMsg(`Zero #${zeroNumber} opened!`);

    // Update demo leaderboard
    const username = "DemoPlayer";
    setDemoPlayers((prev) => {
      const existing = prev.find(p => p.username === username);
      if (existing) {
        return prev.map(p =>
          p.username === username ? { ...p, score: p.score + zeroNumber } : p
        );
      } else {
        return [...prev, { username, score: zeroNumber }];
      }
    });

    setCode(""); // reset input
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md mt-4">
      <input
        className="border p-2 w-full mb-2 text-center text-xl"
        maxLength={3}
        placeholder="Enter 3-digit code"
        value={code}
        onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
      />
      <button
        onClick={submit}
        className="bg-yellow-500 text-white w-full py-2 rounded font-bold hover:bg-yellow-600 transition"
      >
        Play
      </button>
      {msg && <p className="text-center mt-2 text-sm">{msg}</p>}
    </div>
  );
}
