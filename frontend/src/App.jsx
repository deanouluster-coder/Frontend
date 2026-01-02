import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import PayPalButton from "./PayPalButton";

// Global jackpot sound variable
let jackpotSound = null;

export default function Home() {
  const totalZeros = 9;
  const totalJackpot = 1000000;
  const { width, height } = useWindowSize();

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
  const [showJackpotModal, setShowJackpotModal] = useState(false);

  const unlockedAmount = Math.floor((openedZeros.length / totalZeros) * totalJackpot);
  const progressPercent = (openedZeros.length / totalZeros) * 100;
  const isJackpot = openedZeros.includes(totalZeros);

  // Fetch zeros & leaderboard every 5 sec
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

  // Show jackpot modal & play sound if 9th zero opened
  useEffect(() => {
    if (isJackpot) {
      setShowJackpotModal(true);
      if (!jackpotSound) {
        jackpotSound = new Audio("/jackpot.mp3");
        jackpotSound.play().catch(err => console.log("Audio play error:", err));
      }
    }
  }, [isJackpot]);

  const handlePlay = async () => {
    if (!code || code.length !== 3) {
      setMessage("Enter a valid 3-digit code");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/game/play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, username: "Player1" }) // Replace with logged-in user
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

  const handleCloseJackpot = () => {
    setShowJackpotModal(false);
    if (jackpotSound) {
      jackpotSound.pause();
      jackpotSound.currentTime = 0;
      jackpotSound = null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6 flex flex-col items-center relative">
      {/* Confetti for JACKPOT */}
      {isJackpot && <Confetti width={width} height={height} numberOfPieces={500} recycle={false} />}

      <h1 className="text-6xl font-extrabold text-yellow-600 mb-6 drop-shadow-lg animate-pulse">
        Million Zero Vault
      </h1>

      {/* Jackpot Display */}
      <div className="text-center mb-6 relative">
        <h2 className="text-3xl font-bold text-yellow-600">
          Jackpot: <CountUp end={unlockedAmount} duration={1.5} separator="," prefix="$" />
        </h2>
        <p className="text-gray-700">{openedZeros.length} / {totalZeros} zeros opened</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xl bg-gray-200 h-8 rounded-full mb-6 relative overflow-hidden shadow">
        <div
          className="bg-yellow-500 h-8 rounded-full transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />
        {Array.from({ length: totalZeros }).map((_, idx) => {
          const zeroNumber = idx + 1;
          const isOpened = openedZeros.includes(zeroNumber);
          const leftPercent = (idx / (totalZeros - 1)) * 100;
          return (
            <div
              key={idx}
              className={`absolute -top-6 transform -translate-x-1/2 w-12 text-center font-bold text-sm ${
                isOpened ? "text-green-600" : "text-gray-400"
              } ${lastOpened === zeroNumber ? "animate-ping" : ""}`}
              style={{ left: `${leftPercent}%` }}
            >
              Zero {zeroNumber}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded bg-yellow-500 text-white text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap">
                {rewardsMap[zeroNumber]}
              </span>
            </div>
          );
        })}
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
            className="block mt-4 bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition transform hover:-translate-y-1"
          >
            Play
          </button>
          {message && <p className="mt-4 font-semibold text-gray-700">{message}</p>}
        </div>
      )}

      {/* Leaderboard */}
      <div className="w-full max-w-xl bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-yellow-600 text-center mb-4">Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p className="text-gray-500 text-center">No players yet</p>
        ) : (
          <ul>
            {leaderboard.map((p, i) => (
              <li key={i} className="flex justify-between border-b py-1 hover:bg-yellow-50 transition">
                <span>{p.username}</span>
                <span>{p.zerosOpened} zeros</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* JACKPOT Modal */}
      {showJackpotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center max-w-sm animate-scale-up">
            <h2 className="text-3xl font-bold text-yellow-600 mb-4">🎉 JACKPOT! 🎉</h2>
            <p className="text-gray-700 mb-4">Congratulations! All zeros are unlocked!</p>
            <button
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
              onClick={handleCloseJackpot}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
