
"use client";

import { WalletButton } from "@/components/shared/WalletButton";
import { RoundTimer } from "@/components/arena/RoundTimer";
import Link from "next/link";
import { Swords } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-lg z-50">
      <div className="container mx-auto flex items-center justify-between h-20 px-4 sm:px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Swords className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold font-heading">TradeArena</h1>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8">
          <RoundTimer />
          <div className="hidden md:block">
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
