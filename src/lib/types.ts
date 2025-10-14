export interface Asset {
  price: number;
  change: number;
  history: number[];
  symbol: string;
}

export interface UserPosition {
  type: 'buy' | 'sell' | null;
  amount: number; // in base currency (e.g., BTC)
  entryPrice: number;
  leverage: number;
}

export interface User {
  wallet: string | null;
  balance: number;
  equity: number;
  position: UserPosition;
  pnl: number;
}

export interface LeaderboardEntry {
  rank: number;
  avatar: string;
  wallet: string;
  equity: number;
  pnl: number;
}

export interface ChatMessage {
  id: number;
  user: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

export interface TradingGame {
  id: string;
  name: string;
  createdBy: string;
  startingCapital: number;
  startTime: Date;
  players: string[];
}
