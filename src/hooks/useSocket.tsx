"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { useGameContext } from "../../context/gameContext";
import { useWallet } from "@solana/wallet-adapter-react";

export const useSocket = (): Socket | null => {
  const { globalGameCode } = useGameContext();
  const { publicKey } = useWallet();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (socket) {
      socket.disconnect();
    }

    if (globalGameCode && publicKey) {
      const newSocket: Socket = io("http://localhost:5000", {
        query: { gameCode: globalGameCode, player: publicKey.toBase58() },
        reconnection: true,
        // autoConnect: false,
      });
      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        newSocket.emit("join_game", {
          game_code: globalGameCode,
          address: publicKey.toBase58(),
        });
      });

      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    }
  }, [globalGameCode, publicKey]);

  return socket;
};
