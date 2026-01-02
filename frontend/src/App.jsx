import { useState, useEffect } from "react";
import Leaderboard from "./components/Leaderboard";
import GameInput from "./components/GameInput";
import Paywall from "./components/Paywall";
import { getToken } from "./utils/auth";
import PlayGame from "./components/PlayGame";

<PlayGame />
export default function App() {
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold text-yellow-600 mb-4">
        Million Zero Vault
      </h1>

      {!getToken() && <Paywall />}

      {getToken() && (
        <GameInput onSuccess={() => setRefreshLeaderboard(!refreshLeaderboard)} />
      )}

      <Leaderboard refresh={refreshLeaderboard} />
    </div>
  );
}
