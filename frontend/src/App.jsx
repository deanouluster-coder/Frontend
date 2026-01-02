import { useState, useEffect } from "react";
import Leaderboard from "./components/Leaderboard";
import GameInput from "./components/GameInput";
import Paywall from "./components/Paywall";
import { getToken, demoLogin } from "./utils/auth";

export default function App() {
  const [demoPlayers, setDemoPlayers] = useState([]);

  // Auto-login for demo
  useEffect(() => {
    demoLogin();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold text-yellow-600 mb-4">
        Million Zero Vault
      </h1>

      {!getToken() && <Paywall />}

      {getToken() && (
        <GameInput demoPlayers={demoPlayers} setDemoPlayers={setDemoPlayers} />
      )}

      <Leaderboard demoPlayers={demoPlayers} />
    </div>
  );
}
