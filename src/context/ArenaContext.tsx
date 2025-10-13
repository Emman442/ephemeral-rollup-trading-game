"use client";

import { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  INITIAL_ASSETS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_LEADERBOARD,
  INITIAL_USER,
} from "@/lib/mock-data";
import type {
  Asset,
  ChatMessage,
  LeaderboardEntry,
  User,
  UserPosition,
} from "@/lib/types";

const ROUND_DURATION = 300; // 5 minutes

interface ArenaState {
  connected: boolean;
  user: User;
  assets: Record<string, Asset>;
  currentAsset: string;
  leaderboard: LeaderboardEntry[];
  chat: ChatMessage[];
  roundState: {
    duration: number;
    timeLeft: number;
    isRunning: boolean;
  };
}

type ArenaAction =
  | { type: 'CONNECT_WALLET'; payload: string }
  | { type: 'DISCONNECT_WALLET' }
  | { type: 'TICK' }
  | { type: 'START_ROUND' }
  | { type: 'SEND_MESSAGE'; payload: string }
  | { type: 'ADD_SYSTEM_MESSAGE'; payload: string }
  | { type: 'SWITCH_ASSET'; payload: string }
  | { type: 'TRADE'; payload: { type: 'buy' | 'sell'; tradeAmountUSD: number; leverage: number } }
  | { type: 'CLOSE_POSITION' }
  | { type: 'SET_ROUND_OVER' };

const initialState: ArenaState = {
  connected: false,
  user: INITIAL_USER,
  assets: INITIAL_ASSETS,
  currentAsset: "BTC",
  leaderboard: INITIAL_LEADERBOARD,
  chat: INITIAL_CHAT_MESSAGES,
  roundState: {
    duration: ROUND_DURATION,
    timeLeft: ROUND_DURATION,
    isRunning: false,
  },
};

const arenaReducer = (state: ArenaState, action: ArenaAction): ArenaState => {
  switch (action.type) {
    case 'CONNECT_WALLET':
      return {
        ...state,
        connected: true,
        user: { ...INITIAL_USER, wallet: action.payload },
        leaderboard: [
          ...INITIAL_LEADERBOARD.filter((u) => u.wallet !== "You"),
          {
            rank: 0,
            wallet: "You",
            avatar: `https://picsum.photos/seed/you/40/40`,
            equity: INITIAL_USER.equity,
            pnl: 0,
          },
        ].sort((a,b) => b.equity - a.equity).map((u, i) => ({...u, rank: i+1}))
      };
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        connected: false,
        user: INITIAL_USER,
        leaderboard: INITIAL_LEADERBOARD,
      };
    case 'START_ROUND': {
      const newState = {
        ...state,
        roundState: { duration: ROUND_DURATION, timeLeft: ROUND_DURATION, isRunning: true },
        user: { ...state.user, balance: 10000, equity: 10000, pnl: 0, position: INITIAL_USER.position },
        leaderboard: state.leaderboard.map(u => ({...u, equity: 10000, pnl: 0})),
        assets: INITIAL_ASSETS,
      };
      const systemMessage: ChatMessage = {
          id: state.chat.length + 1,
          user: 'TradeArena',
          text: "New round started! Good luck!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true,
      };
      return {...newState, chat: [...newState.chat.slice(-100), systemMessage]};
    }
    case 'TICK': {
      if (!state.roundState.isRunning) return state;

      const newTimeLeft = state.roundState.timeLeft - 1;
      
      let chat = state.chat;
      if (newTimeLeft === 15) {
          const systemMessage: ChatMessage = {
              id: state.chat.length + 1,
              user: 'TradeArena',
              text: "Round ending in 15 seconds!",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isSystem: true,
          };
          chat = [...state.chat.slice(-100), systemMessage];
      }
      
      if (newTimeLeft <= 0) {
        let finalState = { ...state, chat };
        // Close position
        if (finalState.user.position.type) {
            const currentPrice = finalState.assets[finalState.currentAsset].price;
            const entryPrice = finalState.user.position.entryPrice;
            const amount = finalState.user.position.amount;
            let pnl = 0;
            if (finalState.user.position.type === 'buy') {
                pnl = (currentPrice - entryPrice) * amount;
            } else {
                pnl = (entryPrice - currentPrice) * amount;
            }
            const originalInvestment = (entryPrice * amount) / finalState.user.position.leverage;

            const positionCloseMessage: ChatMessage = {
                id: finalState.chat.length + 1,
                user: 'TradeArena',
                text: `Position closed. P&L: $${pnl.toFixed(2)}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSystem: true,
            };
            
            finalState = {
                ...finalState,
                user: {
                    ...finalState.user,
                    balance: finalState.user.balance + originalInvestment + pnl,
                    equity: finalState.user.balance + originalInvestment + pnl,
                    pnl: 0,
                    position: { type: null, amount: 0, entryPrice: 0, leverage: 1 },
                },
                chat: [...finalState.chat.slice(-100), positionCloseMessage]
            };
        }
        
        const roundOverMessage: ChatMessage = {
            id: finalState.chat.length + 1,
            user: 'TradeArena',
            text: "Round over! Final rankings are in.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystem: true,
        };

        return { ...finalState, roundState: { ...finalState.roundState, isRunning: false, timeLeft: 0 }, chat: [...finalState.chat.slice(-100), roundOverMessage] };
      }

      const newAssets = { ...state.assets };
      Object.keys(newAssets).forEach((key) => {
        const asset = newAssets[key];
        const change = (Math.random() - 0.5) * (asset.price * 0.001);
        const newPrice = Math.max(0, asset.price + change);
        asset.price = newPrice;
        asset.history = [...asset.history.slice(1), newPrice];
        asset.change = ((newPrice - asset.history[0]) / asset.history[0]) * 100;
      });

      let newUser = { ...state.user };
      if (newUser.position.type) {
        const currentPrice = newAssets[state.currentAsset].price;
        const entryPrice = newUser.position.entryPrice;
        const positionAmount = newUser.position.amount;
        let pnl = 0;
        if (newUser.position.type === "buy") {
          pnl = (currentPrice - entryPrice) * positionAmount;
        } else {
          pnl = (entryPrice - currentPrice) * positionAmount;
        }
        newUser.pnl = pnl;
        newUser.equity = newUser.balance + pnl;
      }

      const newLeaderboard = state.leaderboard.map((entry) => {
        if (entry.wallet === "You") {
          return { ...entry, equity: newUser.equity, pnl: ((newUser.equity - 10000) / 10000) * 100 };
        }
        const newEquity = entry.equity + (Math.random() - 0.495) * 100;
        return { ...entry, equity: newEquity, pnl: ((newEquity - 10000) / 10000) * 100 };
      }).sort((a, b) => b.equity - a.equity)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      return {
        ...state,
        assets: newAssets,
        user: newUser,
        leaderboard: newLeaderboard,
        roundState: { ...state.roundState, timeLeft: newTimeLeft },
        chat
      };
    }
    case 'SEND_MESSAGE': {
      if (!state.user.wallet) return state;
      const newMessage: ChatMessage = {
        id: state.chat.length + 1,
        user: "You",
        text: action.payload,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: false,
      };
      return { ...state, chat: [...state.chat, newMessage] };
    }
    case 'ADD_SYSTEM_MESSAGE': {
      const newMessage: ChatMessage = {
        id: state.chat.length + 1,
        user: 'TradeArena',
        text: action.payload,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true,
      };
      return { ...state, chat: [...state.chat.slice(-100), newMessage] };
    }
    case 'SWITCH_ASSET':
      return { ...state, currentAsset: action.payload };
    case 'TRADE': {
      const { type, tradeAmountUSD, leverage } = action.payload;
      if (state.user.position.type) {
        const systemMessage: ChatMessage = {
          id: state.chat.length + 1,
          user: 'TradeArena',
          text: "Close your existing position first.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true,
        };
        return { ...state, chat: [...state.chat.slice(-100), systemMessage] };
      }
      const currentPrice = state.assets[state.currentAsset].price;
      const amountInAsset = (tradeAmountUSD * leverage) / currentPrice;

      const newPosition: UserPosition = { type, amount: amountInAsset, entryPrice: currentPrice, leverage };
      const newBalance = state.user.balance - tradeAmountUSD;

      const tradeMessage: ChatMessage = {
        id: state.chat.length + 1,
        user: 'TradeArena',
        text: `You ${type === 'buy' ? 'bought' : 'sold'} ${amountInAsset.toFixed(4)} ${state.currentAsset} at $${currentPrice.toFixed(2)} with ${leverage}x leverage.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true,
      };

      return {
        ...state,
        user: { ...state.user, balance: newBalance, position: newPosition },
        chat: [...state.chat.slice(-100), tradeMessage],
      };
    }
    case 'CLOSE_POSITION': {
      if (!state.user.position.type) return state;

      const currentPrice = state.assets[state.currentAsset].price;
      const { entryPrice, amount, leverage, type } = state.user.position;
      let pnl = 0;
      if (type === 'buy') {
        pnl = (currentPrice - entryPrice) * amount;
      } else {
        pnl = (entryPrice - currentPrice) * amount;
      }
      
      const originalInvestment = (entryPrice * amount) / leverage;

      const closeMessage: ChatMessage = {
        id: state.chat.length + 1,
        user: 'TradeArena',
        text: `Position closed. P&L: $${pnl.toFixed(2)}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true,
      };

      return {
        ...state,
        user: {
          ...state.user,
          balance: state.user.balance + originalInvestment + pnl,
          equity: state.user.balance + originalInvestment + pnl,
          pnl: 0,
          position: { type: null, amount: 0, entryPrice: 0, leverage: 1 },
        },
        chat: [...state.chat.slice(-100), closeMessage],
      };
    }
    case 'SET_ROUND_OVER': {
       const roundOverMessage: ChatMessage = {
            id: state.chat.length + 1,
            user: 'TradeArena',
            text: "Round over! Final rankings are in.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystem: true,
        };

        const finalState = { ...state, roundState: { ...state.roundState, isRunning: false }, chat: [...state.chat.slice(-100), roundOverMessage]};
        
        if (!finalState.user.position.type) return finalState;
        return arenaReducer(finalState, { type: 'CLOSE_POSITION' });

    }
    default:
      return state;
  }
};

const ArenaContext = createContext<{
  state: ArenaState;
  dispatch: React.Dispatch<ArenaAction>;
} | undefined>(undefined);

export const ArenaProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(arenaReducer, initialState);

  return (
    <ArenaContext.Provider value={{ state, dispatch }}>
      {children}
    </ArenaContext.Provider>
  );
};

export const useArena = () => {
  const context = useContext(ArenaContext);
  if (context === undefined) {
    throw new Error('useArena must be used within an ArenaProvider');
  }
  return context;
};
