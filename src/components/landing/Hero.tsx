
"use client";
import { useState } from "react";
import { CreateGameForm } from "@/components/landing/CreateGameForm";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export function Hero() {
  const { connected } = useWallet();
  const [isCreateGameOpen, setCreateGameOpen] = useState(false);

  return (
    <>
      <div className="relative isolate overflow-hidden h-full">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-gradient-to-br from-background via-purple-900/10 to-green-900/10"
            style={{
              backgroundSize: "400% 400%",
            }}
          />
          <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="mx-auto max-w-2xl text-center flex flex-col justify-center h-full px-6 lg:px-8 py-24 sm:py-32">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground text-white sm:text-6xl">
              TradeArena
              <span className="text-primary">.</span>
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground font-heading">
              Compete. Trade. Win.
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-md mx-auto">
              Join real-time trading battles on Solana. Fast. Gasless.
              Competitive.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {connected ? (
                <Button onClick={() => setCreateGameOpen(true)} size="lg">
                  Create Game
                </Button>
              ) : (
                <WalletMultiButton style={{
                  backgroundColor: "#13D991",
                  color: "white",
                  borderRadius: "8px",
                  padding: "5px 20px",
                  fontSize: "16px",
                  fontWeight: "600",
                  height: "44px",
                  border: "none",
                }}/>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreateGameForm
        isOpen={isCreateGameOpen}
        onOpenChange={setCreateGameOpen}
      />
    </>
  );
}
