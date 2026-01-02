import { useState } from "react";

export default function GameInput({ onSuccess, demoPlayers, setDemoPlayers }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const submit = () => {
    if (code.length !== 3) return setMsg("Enter exactly 3 digits");

    // Demo behavior: randomly open a zero
    const zeroNumber = Math.floor(Math.random() * 9) + 1;
    setMsg(`Zero #${zeroNumber} opened!`);

    // Update demo leaderboard
    const randomUser = "DemoPlayer";
    setDemoPlayers((prev) => {
      const existing = prev.find(p => p.username === randomUser);
      if (existing) {
        return prev.map(p =>
          p.username === randomUser ? { ...p, score: p.score + zeroNumber } : p
        );
      } else {
        return [...prev, { username: randomUser, score: zeroNumber }];
      }
    });

    if (onSuccess) onSuccess();
    setCode("");
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
