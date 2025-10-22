"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GameContextType {
    globalGameCode: string | null;
    player: string | null;
    setGameDetails: (gameCode: string, player: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [globalGameCode, setGlobalGameCode] = useState<string | null>(null);
    const [player, setPlayer] = useState<string | null>(null);

    const setGameDetails = (newGameCode: string, newPlayer: string) => {
        setGlobalGameCode(newGameCode);
        setPlayer(newPlayer);
    };

    return (
        <GameContext.Provider value= {{ globalGameCode, player, setGameDetails }
}>
    { children }
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
};