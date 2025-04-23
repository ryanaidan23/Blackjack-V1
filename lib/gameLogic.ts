// lib/gameLogic.ts

export type Card = {
    suit: string;
    value: string;
  };
  
  const suits = ['♠️', '♥️', '♦️', '♣️'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  export const createDeck = (): Card[] => {
    const deck: Card[] = [];
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit, value });
      }
    }
    return shuffle(deck);
  };
  
  const shuffle = (deck: Card[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };
  
  export const getCardValue = (card: Card): number => {
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
  };
  
  export const calculateHandValue = (hand: Card[]): number => {
    let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === 'A').length;
  
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
  
    return value;
  };
  