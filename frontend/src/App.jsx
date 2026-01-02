import { useState, useEffect } from "react";
import Leaderboard from "./components/Leaderboard";
import GameInput from "./components/GameInput";
import Paywall from "./components/Paywall";
import { getToken, demoLogin } from "./utils/auth";

export default function App() {
  const [demoPlayers, setDemoPlayers] = useState([]);

  useEffect(() => {
    demoLogin(); // auto-login demo token
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold text-yellow-600 mb-4">
        Million Zero Vault
      </h1>

      {/* Show GameInput if demo token exists */}
      {getToken() ? (
        <GameInput demoPlayers={demoPlayers} setDemoPlayers={setDemoPlayers} />
      ) : (
        <Paywall />
      )}

      <Leaderboard demoPlayers={demoPlayers} />
    </div>
  );
}
