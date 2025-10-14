
"use client";

import { useArena } from "@/context/ArenaContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Users, Calendar, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function GameList() {
    const { state, dispatch } = useArena();
    const { games } = state;
    const router = useRouter();
    const { connected } = useWallet();
    const { setVisible } = useWalletModal();

    const handleJoinGame = (gameId: string) => {
        if (!connected) {
            setVisible(true);
            return;
        }
        dispatch({ type: "JOIN_GAME", payload: gameId });
        router.push("/arena");
    };

    if (games.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-12 text-center">
                <h2 className="text-2xl font-bold font-heading mb-4">No Games Yet</h2>
                <p className="text-muted-foreground">Be the first to create a trading game!</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h2 className="text-3xl font-bold font-heading mb-8 text-center">Open Games</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {games.map((game) => (
                    <Card key={game.id} className="glassmorphism flex flex-col">
                        <CardHeader>
                            <CardTitle>{game.name}</CardTitle>
                            <CardDescription>Created by {game.createdBy.slice(0, 4)}...{game.createdBy.slice(-4)}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <span>${game.startingCapital.toLocaleString()} Starting Capital</span>
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
                            <Button className="w-full" onClick={() => handleJoinGame(game.id)}>Join Game</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
