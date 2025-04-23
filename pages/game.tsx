// pages/game.tsx

import { useEffect, useState } from 'react';
import { Card, createDeck, calculateHandValue } from '../lib/gameLogic';

const Game = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const newDeck = createDeck();
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    const dealerCards = [newDeck.pop()!, newDeck.pop()!];

    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setMessage('');
  };

  const hit = () => {
    if (calculateHandValue(playerHand) >= 21) return;

    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newPlayerHand = [...playerHand, newCard];

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);

    if (calculateHandValue(newPlayerHand) > 21) {
      setMessage('Bust! You lose.');
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
    } else if (playerTotal < dealerTotal) {
      result = 'You lose!';
    } else {
      result = 'Push!';
    }

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setMessage(result);
  };

  const renderCards = (hand: Card[]) =>
  hand.map((card, i) =>
    card?.value && card?.suit ? (
      <span key={i} className="inline-block mx-1 p-2 border rounded bg-white shadow text-lg">
        {card.value}{card.suit}
      </span>
    ) : (
      <span key={i} className="inline-block mx-1 p-2 border rounded bg-gray-200 shadow text-lg">
        ❓
      </span>
    )
  );


  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">🃏 Blackjack</h1>

      <div className="mb-4">
        <h2 className="font-semibold">Your Hand ({calculateHandValue(playerHand)})</h2>
        <div>{renderCards(playerHand)}</div>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Dealer's Hand ({message ? calculateHandValue(dealerHand) : '??'})</h2>
        <div>
          {message
            ? renderCards(dealerHand)
            : renderCards([dealerHand[0], { suit: '?', value: '?' }])}
        </div>
      </div>

      <div className="space-x-4 mt-6">
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
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          onClick={startGame}
        >
          Restart
        </button>
      </div>

      {message && <div className="mt-6 text-xl font-bold">{message}</div>}
    </div>
  );
};

export default Game;
