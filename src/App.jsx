import { useEffect, useState } from "react";
import Leaderboard from "./components/Leaderboard";

const TOTAL_ZEROS = 9;

const rewards = {
  1: "No reward",
  2: "5 Tokens",
  3: "10 Tokens",
  4: "$25 PayPal",
  5: "25 Tokens",
  6: "$50 PayPal",
  7: "No reward",
  8: "No reward",
  9: "JACKPOT 🎉"
};

export default function App() {
  const [openedZeros, setOpenedZeros] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/play/opened-zeros`)
      .then(res => res.json())
      .then(data => data.success && setOpenedZeros(data.openedZeros))
      .catch(console.error);

    fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`)
      .then(res => res.json())
      .then(data => data.success && setPlayers(data.players))
      .catch(() => {});
  }, []);

  const progress = (openedZeros.length / TOTAL_ZEROS) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center p-6">
      <h1 className="text-5xl font-extrabold text-yellow-600 mb-4">
        Million Zero Vault
      </h1>

      <p className="text-gray-700 mb-6 text-center max-w-xl">
        Guess the correct 3-digit code to unlock zeros of the million.
      </p>

      <div className="w-full max-w-xl bg-white p-6 rounded shadow">
        <div className="w-full bg-gray-300 h-6 rounded overflow-hidden">
          <div
            className="bg-yellow-500 h-6 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between mt-3 text-sm">
          {Array.from({ length: TOTAL_ZEROS }).map((_, i) => (
            <span
              key={i}
              className={openedZeros.includes(i + 1) ? "text-green-600" : "text-gray-400"}
              title={rewards[i + 1]}
            >
              0
            </span>
          ))}
        </div>
      </div>

      <Leaderboard players={players} />

      <footer className="mt-12 text-gray-500 text-sm">
        © 2026 Million Zero Vault
      </footer>
    </div>
  );
}
