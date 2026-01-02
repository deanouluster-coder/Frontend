import React from "react";

export default function Leaderboard({ demoPlayers }) {
  return (
    <div className="bg-white w-full max-w-xl rounded shadow p-4 mt-6">
      <h2 className="text-xl font-bold mb-3 text-center text-yellow-600">
        Leaderboard
      </h2>

      {demoPlayers.length === 0 ? (
        <p className="text-center text-gray-500">No players yet</p>
      ) : (
        demoPlayers.map((player, idx) => (
          <div
            key={idx}
            className="flex justify-between border-b py-1 hover:bg-yellow-50 transition-colors"
          >
            <span className="font-medium">{player.username}</span>
            <span className="font-semibold text-yellow-600">{player.score}</span>
          </div>
        ))
      )}
    </div>
  );
}
