
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useArena } from "@/context/ArenaContext";

export function Leaderboard() {
  const { state } = useArena();
  const { leaderboard } = state;
  
  return (
    <ScrollArea className="h-full">
      <Table>
        <TableHeader className="sticky top-0 bg-card/80 backdrop-blur-sm">
          <TableRow>
            <TableHead className="w-1/4">Rank</TableHead>
            <TableHead className="w-2/4">User</TableHead>
            <TableHead className="w-1/4 text-right">Equity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.wallet === "You";
              return (
                <motion.tr
                  key={entry.wallet}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                    isCurrentUser && "bg-primary/10"
                  )}
                >
                  <TableCell className="font-medium">{entry.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                       <Avatar className="h-8 w-8">
                        <Image src={entry.avatar} alt={entry.wallet} width={32} height={32} data-ai-hint="person face" />
                        <AvatarFallback>{entry.wallet.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{entry.wallet}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">${entry.equity.toFixed(2)}</TableCell>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
