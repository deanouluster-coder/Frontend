import { useState } from "react";

export default function PlayGame() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const play = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/game/play`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, username: "Player1" })
      }
    );

    const data = await res.json();
    setMessage(data.message);
    setCode("");
  };

  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Enter 3-Digit Code</h2>

      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        maxLength={3}
        className="border p-2 text-center text-xl w-32"
      />

      <button
        onClick={play}
        className="block mt-4 bg-yellow-500 text-white px-6 py-2 rounded"
      >
        Play
      </button>

      {message && <p className="mt-4 font-semibold">{message}</p>}
    </div>
  );
}
