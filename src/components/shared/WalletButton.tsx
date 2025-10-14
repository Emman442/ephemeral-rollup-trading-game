"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Wallet, ChevronsRight } from "lucide-react";
import { useArena } from "@/context/ArenaContext";
import Link from "next/link";

export function WalletButton() {
  const { publicKey, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { state, dispatch } = useArena();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (publicKey) {
      const walletAddress = publicKey.toBase58();
      dispatch({ type: 'CONNECT_WALLET', payload: walletAddress });
    } else {
      dispatch({ type: 'DISCONNECT_WALLET' });
    }
  }, [publicKey, dispatch]);

  if (!isClient) {
    return (
      <Button disabled className="w-48">
        <Wallet className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  if (!publicKey || !state.connected) {
    return (
      <Button onClick={() => setVisible(true)} className="w-48">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  const shortAddress = `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`;

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-40">
            <Wallet className="mr-2 h-4 w-4" />
            {shortAddress}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card border-border">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            disconnect();
            router.push('/');
          }}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button asChild>
        <Link href="/arena">
          Go to Arena
          <ChevronsRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
