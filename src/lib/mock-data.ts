import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Asset, LeaderboardEntry, User } from "./types";

const userWallets = [
  'AlphaWolf', 'CryptoNinja', 'SOLWhale', 'Trader42', 'PixelPundit',
  'ByteBaron', 'ChainSurfer', 'DataDemon', 'EtherEagle', 'FutureForge'
];

export const INITIAL_USER: User = {
  wallet: null,
  balance: 10000,
  equity: 10000,
  position: {
    type: null,
    amount: 0,
    entryPrice: 0,
    leverage: 1,
  },
  pnl: 0,
};

export const INITIAL_ASSETS: Record<string, Asset> = {
  BTC: {
    price: 64320,
    change: 1.2,
    history: Array.from({ length: 50 }, () => 64320 + (Math.random() - 0.5) * 500),
    symbol: "BTC/USDC",
  },
  SOL: {
    price: 150.45,
    change: -2.5,
    history: Array.from({ length: 50 }, () => 150.45 + (Math.random() - 0.5) * 5),
    symbol: "SOL/USDC",
  },
  ETH: {
    price: 3500.1,
    change: 0.8,
    history: Array.from({ length: 50 }, () => 3500.1 + (Math.random() - 0.5) * 50),
    symbol: "ETH/USDC",
  },
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = userWallets
  .map((wallet, index) => ({
    rank: index + 1,
    avatar: PlaceHolderImages[index % PlaceHolderImages.length]?.imageUrl || `https://picsum.photos/seed/${index + 1}/40/40`,
    wallet,
    equity: 10000 + (Math.random() * 5000 - 2500),
    pnl: (Math.random() * 20 - 10),
  }))
  .sort((a, b) => b.equity - a.equity)
  .map((user, index) => ({ ...user, rank: index + 1 }));

export const INITIAL_CHAT_MESSAGES = [
    { id: 1, user: "CryptoNinja", text: "LFG 🚀", time: "12:01", isSystem: false },
    { id: 2, user: "SOLWhale", text: "This price feed is nuts!", time: "12:02", isSystem: false },
    { id: 3, user: "TradeArena", text: "Welcome to the Arena! Round starts now.", time: "12:00", isSystem: true },
];
