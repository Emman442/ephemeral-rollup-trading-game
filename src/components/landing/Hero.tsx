
"use client";

import { motion } from "framer-motion";
import { WalletButton } from "@/components/shared/WalletButton";

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden h-[calc(100vh-80px)]">
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-background via-purple-900/10 to-green-900/10"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: '400% 400%',
          }}
        />
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      <div className="mx-auto max-w-2xl text-center flex flex-col justify-center h-full px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            TradeArena
            <span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground font-heading">
            Compete. Trade. Win.
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-md mx-auto">
            Join real-time trading battles on Solana. Fast. Gasless. Competitive.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <WalletButton />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
