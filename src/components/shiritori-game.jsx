import { useEffect, useState } from "react";

const ShiritoriGame = () => {
  const [players, setPlayers] = useState([
    { name: "Player 1", score: 0 },
    { name: "PLayer 2", score: 0 },
  ]);

  const [countdownTime, setCountdownTime] = useState(11);
  const [activePlayer, setActivePlayer] = useState(1);
  const [inputWord, setInputWord] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  //   console.log({ activePlayer });
  const switchTurn = () => {
    // setActivePlayer((prev) => {
    //   console.log("from switch turn", prev);
    //   return prev === 2;
    // });
    if(activePlayer === 1) setActivePlayer(2);
    if(activePlayer === 2) setActivePlayer(1);
    setError("");
    setInputWord("");
  };

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdownTime((prev) => {
        if (prev <= 0) {
          const playersCopy = [...players];
          if(error) {
            playersCopy[activePlayer - 1].score -= 1;
          }
          else{playersCopy[activePlayer - 1].score += 1;}
          switchTurn();
          //   console.log(activePlayer);
          return 11;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [activePlayer, players]);

  const validateWord = async (word) => {
    if (word.length < 4) {
      setError("Word can't be less than 4 characters");
      setInputWord("");
      return;
    }
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      console.log(res);
      if (!res.ok) {
        setError("Word not found");
        setInputWord("")
        return;
      }
    } catch (error) {
      setError(error.message);
      setInputWord("");
      return;
    }

    if (history.length > 0) {
      const lastWord = history[history.length - 1];
      const lastWordLastch = lastWord[lastWord.length - 1];

      const inputWordsFistch = inputWord[inputWord.length - 1];

      if (lastWordLastch === inputWordsFistch) {
        setError("the Word is used");
        setInputWord("");
        return;
      }
    }
    return word;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const word = inputWord.toLowerCase();
    const isValidWord = await validateWord(word);
    const playersCopy = [...players];

    if (isValidWord) {
      if (history.includes(isValidWord)) {
        setError("World is already used");
        setInputWord("");
        return;
      }
      setHistory((prev) => [...prev, isValidWord]);

      playersCopy[activePlayer - 1].score += 1;
      setInputWord("");
    }
    playersCopy[activePlayer - 1].score -= 1;
  };

  return (
    <div className="min-h-screen p-10 text-white bg-gray-800 flex items-center justify-center">
      <div>
        <h2 className="text-slate-200 text-2xl mb-7">Shiritori Simplified</h2>
        <div className="flex gap-10">
          <div className={`p-10 bg-indigo-700/40 border-indigo-100/40 rounded-md border text-white ${activePlayer === 1 ? "animate-pulse delay-700" : ""}`}>
            <h3>Player 1</h3>
            <p>Score: {players[0].score}</p>
          </div>
          <div className={`p-10 bg-purple-700/30 border-indigo-100/40 rounded-md border text-white ${activePlayer === 2 && "animate-pulse"}`}>
            <h3>Player 1</h3>
            <p>Score: {players[0].score}</p>
          </div>
        </div>
        <p className={`${countdownTime< 5 ? "text-red-500" : "text-green-500"} font-bold text-lg`}>{countdownTime}</p>

        {/* form */}
        <div>
          <p className={`${activePlayer === 1 ? "text-indigo-400" : "text-purple-400"} font-semibold`}>{activePlayer === 1 ? "PLayer 1 turn" : "Player 2 turn"}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            placeholder="Type Word..."
            className={` ${
              activePlayer ? "border-purple-300" : "border-indigo-300"
            } border focus:outline-none text-white  px-4 py-2 rounded-md w-full mt-5`}
          />

          <button
            type="submit"
            className="px-4 py-2 mt-5 hover:bg-green-800 transition-colors duration-300 bg-green-700 rounded-md"
          >
            Submit
          </button>
          <p className="mt-3 text-red-500">{error}</p>
        </form>

        <div className="mt-10 space-y-2">
          <p>Word History</p>
          {history.map((item, i) => (
            <p key={i}>{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShiritoriGame;
