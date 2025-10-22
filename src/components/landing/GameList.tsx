"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, set } from "date-fns";
import { Users, Calendar, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { useGameContext } from "../../../context/gameContext";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
import { startTransition, useState } from "react";

export function GameList() {
  const { setGameDetails } = useGameContext();
  const [isJoining, setIsJoining] = useState(false);
  const socket = useSocket();
  const games = [
    {
      id: "game1",
      name: "Crypto Trading Showdown",
      createdBy: "AbC1234XyZ",
      startingCapital: 10000,
      startTime: new Date(Date.now() + 86400000), // Starts in 1 day

      players: ["Player1", "Player2"],
      gameCode: "ABCD1234",
    },
  ];

  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const handleJoinGame = (gameCode: string) => {
    if (!connected || !publicKey) {
      setVisible(true);
      return;
    }
    setIsJoining(true);

    const datas = {
      game_code: gameCode,
      address: publicKey.toString(),
    };

    setGameDetails(gameCode, publicKey!.toBase58());
    const sendJoinEvent = () => {
      if (socket) {
        console.log("✅ Emitting join_game now!");
        socket.emit("join_game", {
          ...datas,
        });
        toast.success("Joined game successfully");
        //  router.push("/arena");
        startTransition(() => {
          router.push("/arena");
        });
      } else {
        toast.error("Failed to connect to game. Please try again.");
      }
    };

    if (socket) {
      if (socket.connected) {
        sendJoinEvent();
      } else {
        console.log(
          "❌ Socket not connected yet... Waiting for connect event..."
        );
        socket.once("connect", () => {
          console.log("✅ Socket connected! Now emitting join_game...");
          sendJoinEvent();
          setIsJoining(false);
        });
      }
    } else {
      console.log(
        "❌ Socket is null initially. Waiting for socket to connect."
      );
      toast.error("Socket not ready. Please refresh or try again.");
    }
    setIsJoining(false);
  };

  if (games.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <h2 className="text-2xl font-bold font-heading mb-4">No Games Yet</h2>
        <p className="text-muted-foreground">
          Be the first to create a trading game!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h2 className="text-3xl font-bold font-heading mb-8 text-center">
        Open Games
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Card key={game.id} className="glassmorphism flex flex-col">
            <CardHeader>
              <CardTitle>{game.name}</CardTitle>
              <CardDescription>
                Created by {game.createdBy.slice(0, 4)}...
                {game.createdBy.slice(-4)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>
                  ${game.startingCapital.toLocaleString()} Starting Capital
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Starts on {format(game.startTime, "PPP")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>{game.players.length} player(s)</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleJoinGame(game.gameCode)}
              >
                {isJoining ? "Joining Game..." : "Join Game"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
