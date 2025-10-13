"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useArena } from "@/context/ArenaContext";

const TRADE_AMOUNTS = [100, 500, 1000, 2500];

export function TradingPanel() {
  const { state, dispatch } = useArena();
  const { user, currentAsset, assets } = state;
  const [leverage, setLeverage] = useState([1]);
  const [tradeAmount, setTradeAmount] = useState(100);

  const asset = assets[currentAsset];

  const trade = (type: "buy" | "sell", tradeAmountUSD: number, leverage: number) => {
    dispatch({ type: 'TRADE', payload: { type, tradeAmountUSD, leverage }});
  }

  const closePosition = () => {
    dispatch({ type: 'CLOSE_POSITION' });
  }

  return (
    <div className="glassmorphism flex-grow flex flex-col p-1">
      <Card className="bg-transparent border-0 flex-grow flex flex-col">
        <CardHeader>
          <CardTitle className="font-heading">Trading Console</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-lg font-bold">${user.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equity</p>
                <p className="text-lg font-bold">${user.equity.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Position</p>
                <p className="text-lg font-bold">
                  {user.position.type
                    ? `${user.position.amount.toFixed(4)} ${currentAsset}`
                    : "None"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unrealized P/L</p>
                <p className={cn("text-lg font-bold", user.pnl >= 0 ? "text-primary" : "text-red-500")}>
                  ${user.pnl.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Trade Amount (USD)</p>
                <div className="flex gap-2">
                  {TRADE_AMOUNTS.map((amount) => (
                     <Button 
                        key={amount}
                        variant={tradeAmount === amount ? "default" : "outline"}
                        onClick={() => setTradeAmount(amount)}
                        className="flex-1"
                        size="sm"
                     >
                        ${amount}
                     </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Leverage: {leverage[0]}x</p>
                <Slider
                  defaultValue={[1]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={setLeverage}
                  disabled={!!user.position.type}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            {user.position.type ? (
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg py-6"
                onClick={closePosition}
              >
                Close Position
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="w-full text-lg py-6 buy-gradient"
                  onClick={() => trade("buy", tradeAmount, leverage[0])}
                >
                  Buy / Long
                </Button>
                <Button
                  size="lg"
                  className="w-full text-lg py-6 sell-gradient"
                  onClick={() => trade("sell", tradeAmount, leverage[0])}
                >
                  Sell / Short
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
