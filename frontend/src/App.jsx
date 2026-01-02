import { useEffect, useState } from "react";
import PayPalButton from "./PayPalButton";

export default function Home() {
  const totalZeros = 9;
  const totalJackpot = 1000000;

  const rewardsMap = {
    1: "No reward",
    2: "5 tokens",
    3: "10 tokens",
    4: "25$ PayPal",
    5: "25 tokens",
    6: "50$ PayPal",
    7: "No reward",
    8: "No reward",
    9: "JACKPOT!"
  };

  const [openedZeros, setOpenedZeros] = useState([]);
  const [lastOpened, setLastOpened] = useState(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [paid, setPaid] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const unlockedAmount = Math.floor((openedZeros.length / totalZeros) * totalJackpot);

  // Fetch leaderboard and zeros every 5 sec
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resZeros = await fetch(`${import.meta.env.VITE_API_URL}/api/gameState`);
        const zerosData = await resZeros.json();
        if (zerosData.success) {
          const newZeros = zerosData.openedZeros.filter(z => !openedZeros.includes(z));
          if (newZeros.length > 0) setLastOpened(newZeros[newZeros.length - 1]);
          setOpenedZeros(zerosData.openedZeros);
        }

        const resLeaderboard = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`);
        const lbData = await resLeaderboard.json();
        if (lbData.success) setLeaderboard(lbData.players);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [openedZeros]);

  const handlePlay = async () => {
    if (!code || code.length !== 3) {
      setMessage("Enter a valid 3-digit code");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/game/play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, username: "Player1" }) // replace username with logged-in user
      });
      const data = await res.json();
      setMessage(data.message);
      setCode("");
    } catch (err) {
      console.error(err);
      setMessage("Error playing the game");
    }
  };

  const handlePaymentSuccess = () => setPaid(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6 flex flex-col items-center">
      <h1 className="text-6xl font-extrabold text-yellow-600 mb-6 drop-shadow-lg">Million Zero Vault</h1>

      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-600">
          Jackpot: ${unlockedAmount.toLocaleString()}
        </h2>
        <p className="text-gray-700">{openedZeros.length} / {totalZeros} zeros opened</p>
      </div>

      {/* PayPal Payment */}
      {!paid && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Pay 1 Token to Play</h2>
          <PayPalButton amount="1.00" onSuccess={handlePaymentSuccess} />
        </div>
      )}

      {/* 3-digit code entry */}
      {paid && (
        <div className="bg-white p-6 rounded shadow text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Enter 3-Digit Code</h2>
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={3}
            className="border p-2 text-center text-xl w-32"
          />
          <button
            onClick={handlePlay}
            className="block mt-4 bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          >
            Play
          </button>
          {message && <p className="mt-4 font-semibold text-gray-700">{message}</p>}
        </div>
      )}

      {/* Reward / Zero display */}
      <div className="w-full max-w-xl bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold text-yellow-600 text-center mb-4">Zeros & Rewards</h2>
        <div className="flex justify-between">
          {Array.from({ length: totalZeros }).map((_, idx) => {
            const zeroNumber = idx + 1;
            const isOpened = openedZeros.includes(zeroNumber);
            return (
              <div key={idx} className={`text-center font-bold ${isOpened ? "text-green-600" : "text-gray-400"}`}>
                Zero {zeroNumber}
                <p className="text-xs mt-1">{rewardsMap[zeroNumber]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="w-full max-w-xl bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-yellow-600 text-center mb-4">Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p className="text-gray-500 text-center">No players yet</p>
        ) : (
          <ul>
            {leaderboard.map((p, i) => (
              <li key={i} className="flex justify-between border-b py-1">
                <span>{p.username}</span>
                <span>{p.zerosOpened} zeros</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
