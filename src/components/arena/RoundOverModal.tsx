"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Wallet } from "lucide-react";
import { useArena } from "@/context/ArenaContext";

interface RoundOverModalProps {
  isOpen: boolean;
}

export function RoundOverModal({ isOpen }: RoundOverModalProps) {
  const { state, dispatch } = useArena();
  const { user, leaderboard } = state;

  const startRound = () => {
    dispatch({ type: 'START_ROUND' });
  };
  
  const userRank = leaderboard.find(e => e.wallet === "You")?.rank || 0;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px] glassmorphism">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-center">
            Round Over!
          </DialogTitle>
          <DialogDescription className="text-center">
            Here's how you performed in this round.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-around text-center">
            <div>
              <Trophy className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Final Rank</p>
              <p className="text-2xl font-bold">{userRank}</p>
            </div>
            <div>
              <Wallet className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Final Equity</p>
              <p className="text-2xl font-bold">${user.equity.toFixed(2)}</p>
            </div>
            <div>
              <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Round P/L</p>
              <p className="text-2xl font-bold">
                {(((user.equity - 10000) / 10000) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={startRound} className="w-full" size="lg">
            Join Next Round
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
