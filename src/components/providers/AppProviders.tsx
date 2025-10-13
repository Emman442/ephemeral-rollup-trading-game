"use client";

import type { FC, ReactNode } from "react";
import { ArenaProvider } from "@/context/ArenaContext";
import { WalletProvider } from "./WalletProvider";

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WalletProvider>
      <ArenaProvider>
        {children}
      </ArenaProvider>
    </WalletProvider>
  );
};
