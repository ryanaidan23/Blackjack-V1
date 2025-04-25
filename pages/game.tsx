// pages/game.tsx

import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { Card, createDeck, calculateHandValue } from '../lib/gameLogic';

const chipTypes = [
  { value: 0.1, color: 'bg-yellow-400' },
  { value: 0.5, color: 'bg-blue-600' },
  { value: 1, color: 'bg-green-600' },
  { value: 5, color: 'bg-red-600' },
  { value: 10, color: 'bg-purple-600' },
];

const Game = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0);
  const [hasBet, setHasBet] = useState(false);

  useEffect(() => {
    if (hasBet) dealCards();
  }, [hasBet]);

  const dealCards = () => {
    const newDeck = createDeck();
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    const dealerCards = [newDeck.pop()!, newDeck.pop()!];

    setDeck(newDeck);
    setPlayerHand([]);
    setDealerHand([]);

    setTimeout(() => setPlayerHand([playerCards[0]]), 200);
    setTimeout(() => setDealerHand([dealerCards[0]]), 400);
    setTimeout(() => setPlayerHand((prev) => [...prev, playerCards[1]]), 600);
    setTimeout(() => setDealerHand((prev) => [...prev, dealerCards[1]]), 800);
    setTimeout(() => setMessage(''), 1000);
  };

  const hit = () => {
    if (calculateHandValue(playerHand) >= 21) return;
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    setDeck(newDeck);
    setPlayerHand([...playerHand, newCard]);

    if (calculateHandValue([...playerHand, newCard]) > 21) {
      setMessage('Bust! You lose.');
      setBalance((prev) => prev - bet);
      setHasBet(false);
      setBet(0);
    }
  };

  const stand = () => {
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];

    while (calculateHandValue(newDealerHand) < 17) {
      newDealerHand.push(newDeck.pop()!);
    }

    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(newDealerHand);
    let result = '';

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
      result = 'You win!';
      setBalance((prev) => prev + bet);
    } else if (playerTotal < dealerTotal) {
      result = 'You lose.';
      setBalance((prev) => prev - bet);
    } else {
      result = 'Push!';
    }

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setMessage(result);
    setHasBet(false);
    setBet(0);
  };

  const handleChipClick = (value: number) => {
    if (!hasBet && bet + value <= balance) {
      setBet((prev) => Math.round((prev + value) * 100) / 100);
    }
  };

  const renderCards = (hand: Card[], faceDown?: boolean) =>
    hand.map((card, i) => {
      const isFaceDown = faceDown && i === 1;
      return (
        <motion.div
          key={i}
          initial={{ x: 300, y: -200, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ delay: i * 0.2, type: 'spring', stiffness: 100 }}
          className={`relative inline-block mx-1 w-12 h-20 border rounded shadow ${
            isFaceDown ? 'bg-pattern-full' : 'bg-white text-black'
          }`}
        >
          {isFaceDown ? (
            <div className="w-full h-full rounded bg-pattern-full border border-white" />
          ) : (
            <span className="absolute top-1 left-1 text-sm font-bold leading-none">
              {card.value}
              {card.suit}
            </span>
          )}
        </motion.div>
      );
    });

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center">
      <div className="relative w-[50vw] h-[75vh] bg-green-900 shadow-inner overflow-hidden rounded-b-full bg-felt text-white font-serif">
        {/* Top Balance */}
        <div className="absolute top-4 left-6 bg-black bg-opacity-30 px-4 py-1 rounded text-yellow-300 font-bold">
          Balance: ${balance}
        </div>

        {/* Deck */}
        <div className="absolute top-4 right-6 w-12 h-20 rounded-sm shadow-md border border-white bg-pattern-full" />

        {/* Dealer's Area */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center z-10">
          <h2 className="font-semibold mb-2">
            Dealer {message ? `(${calculateHandValue(dealerHand)})` : '(??)'}
          </h2>
          <div className="flex justify-center">{renderCards(dealerHand, !message)}</div>
          <div className="text-xl font-extrabold tracking-wide mt-2 uppercase text-gray-100">ZOOT BLACKJACK</div>
        </div>

        {/* Player Area */}
        <div className="absolute bottom-[18%] left-1/2 transform -translate-x-1/2 text-center z-10">
          <h2 className="font-semibold mb-2">You ({calculateHandValue(playerHand)})</h2>
          <div>{renderCards(playerHand)}</div>
        </div>

        {/* Control Buttons */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          {!hasBet && (
            <button
              className="bg-yellow-500 text-black px-4 py-1 rounded hover:bg-yellow-600 font-semibold"
              onClick={() => {
                if (bet > 0 && bet <= balance) setHasBet(true);
              }}
            >
              Place Bet (${bet.toFixed(2)})
            </button>
          )}
          {hasBet && (
            <div className="flex gap-4">
              <button
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                onClick={hit}
                disabled={!!message}
              >
                Hit
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={stand}
                disabled={!!message}
              >
                Stand
              </button>
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className="absolute inset-x-0 bottom-0 text-center text-yellow-300 font-bold text-xl z-10 pb-2">
            {message}
          </div>
        )}

        {/* Placeholders */}
        <div className="absolute bottom-[14%] left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-600 rounded-full opacity-70 border-2 border-white" />
        <div className="absolute bottom-[24%] left-[20%] w-10 h-10 bg-gray-600 rounded-full opacity-30" />
        <div className="absolute bottom-[24%] right-[20%] w-10 h-10 bg-gray-600 rounded-full opacity-30" />
        
        {/* Lightning bolts */}
        <div className="absolute left-[6%] top-1/2 transform -translate-y-1/2 text-4xl text-white opacity-70">⚡</div>
        <div className="absolute right-[6%] top-1/2 transform -translate-y-1/2 text-4xl text-white opacity-70">⚡</div>
      </div>

      {/* Chip Row */}
      {!hasBet && (
        <div className="mt-6 flex gap-4">
          {chipTypes.map((chip) => (
            <button
              key={chip.value}
              onClick={() => handleChipClick(chip.value)}
              className={`w-12 h-12 rounded-full border-2 border-white ${chip.color} shadow-md flex items-center justify-center`}
            >
              <span className="text-white font-bold text-sm">${chip.value}</span>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .bg-felt {
          background-image: url("https://www.transparenttextures.com/patterns/felt.png");
          background-size: 100px 100px;
        }
        .bg-pattern-full {
          background-image: repeating-linear-gradient(
            45deg,
            #222 0,
            #222 2px,
            #333 2px,
            #333 4px
          );
          background-color: #222;
          background-size: 10px 10px;
        }
      `}</style>
    </div>
  );
};

export default Game;
