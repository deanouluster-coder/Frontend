import { useEffect, useState } from "react";
import Leaderboard from "./components/Leaderboard";
import GameInput from "./components/GameInput";
import Paywall from "./components/Paywall";
import { getToken } from "./utils/auth";

export default function App() {
  const [openedZeros, setOpenedZeros] = useState([]);

  const refresh = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/play/opened-zeros`)
      .then(r => r.json())
      .then(d => d.success && setOpenedZeros(d.openedZeros));
  };

  useEffect(refresh, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold text-yellow-600 mb-4">
        Million Zero Vault
      </h1>

      {!getToken() && <Paywall />}
      {getToken() && <GameInput onSuccess={refresh} />}

      <Leaderboard players={[]} />
    </div>
  );
}
