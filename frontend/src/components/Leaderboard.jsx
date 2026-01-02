import React, { useEffect, useState } from "react";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Fetch leaderboard from backend
    fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlayers(data.players);
        }
      })
      .catch((err) => console.error("Failed to load leaderboard:", err));
  }, []);

  return (
    <div className="bg-white w-full max-w-xl rounded shadow p-4 mt-6">
      <h2 className="text-xl font-bold mb-3 text-center text-yellow-600">
        Leaderboard
      </h2>

      {players.length === 0 ? (
        <p className="text-center text-gray-500">No players yet</p>
      ) : (
        <div>
          {players.map((player, index) => (
            <div
              key={index}
              className="flex justify-between border-b py-1 hover:bg-yellow-50 transition-colors"
            >
              <span className="font-medium">{player.username}</span>
              <span className="font-semibold text-yellow-600">{player.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
