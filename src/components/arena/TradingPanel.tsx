
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useArena } from "@/context/ArenaContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const TRADE_PERCENTAGES = [25, 50, 75, 100];

export function TradingPanel() {
  const { state, dispatch } = useArena();
  const { user, currentAsset, assets } = state;
  const [leverage, setLeverage] = useState([1]);
  const [tradeAmount, setTradeAmount] = useState(0);
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  const asset = assets[currentAsset];

  const handleSetAmountFromBalance = (percentage: number) => {
    const amount = (user.balance * percentage) / 100;
    setTradeAmount(amount);
  };

  const trade = (type: "buy" | "sell") => {
    if (tradeAmount <= 0) return;
    dispatch({ type: 'TRADE', payload: { type, tradeAmountUSD: tradeAmount, leverage: leverage[0] }});
    setTradeAmount(0);
  }

  const closePosition = () => {
    dispatch({ type: 'CLOSE_POSITION' });
  }

  const renderOrderForm = (type: "buy" | "sell") => (
    <div className="space-y-4">
      <div>
        <label htmlFor="amount" className="text-sm text-muted-foreground">Amount (USD)</label>
        <Input 
          id="amount"
          type="number"
          value={tradeAmount || ''}
          onChange={(e) => setTradeAmount(parseFloat(e.target.value))}
          placeholder="0.00"
          className="bg-input mt-1"
        />
        <div className="flex gap-2 mt-2">
          {TRADE_PERCENTAGES.map((pct) => (
            <Button 
                key={pct}
                variant="outline"
                size="sm"
                onClick={() => handleSetAmountFromBalance(pct)}
                className="flex-1 text-xs"
            >
                {pct}%
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
        />
      </div>
      <Button
        size="lg"
        className={cn(
          "w-full text-lg py-6",
          type === 'buy' ? "buy-gradient" : "sell-gradient"
        )}
        onClick={() => trade(type)}
      >
        {type === 'buy' ? "Long" : "Short"} {currentAsset}
      </Button>
    </div>
  );

  return (
    <div className="glassmorphism flex-grow flex flex-col p-1">
      <Card className="bg-transparent border-0 flex-grow flex flex-col">
        <CardHeader>
          <CardTitle className="font-heading">Trading Console</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-lg font-bold">${user.balance.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Equity</p>
              <p className="text-lg font-bold">${user.equity.toFixed(2)}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Unrealized P/L</p>
              <p className={cn("text-lg font-bold", user.pnl >= 0 ? "text-primary" : "text-red-500")}>
                ${user.pnl.toFixed(2)}
              </p>
            </div>
          </div>
          
          {user.position.type ? (
            <div className="space-y-4 flex-grow flex flex-col justify-center">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Open Position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asset</span>
                    <span>{currentAsset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Direction</span>
                    <span className={cn(user.position.type === 'buy' ? 'text-primary' : 'text-red-500')}>{user.position.type === 'buy' ? 'Long' : 'Short'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size</span>
                    <span>{user.position.amount.toFixed(4)} {currentAsset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Price</span>
                    <span>${user.position.entryPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Price</span>
                    <span>${asset.price.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between font-bold">
                    <span className="text-muted-foreground">Unrealized P/L</span>
                    <span className={cn(user.pnl >= 0 ? 'text-primary' : 'text-red-500')}>${user.pnl.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg py-6"
                onClick={closePosition}
              >
                Close Position
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="buy" className="w-full" onValueChange={(v) => setActiveTab(v as "buy" | "sell")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Long</TabsTrigger>
                <TabsTrigger value="sell">Short</TabsTrigger>
              </TabsList>
              <TabsContent value="buy" className="pt-4">
                {renderOrderForm("buy")}
              </TabsContent>
              <TabsContent value="sell" className="pt-4">
                {renderOrderForm("sell")}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
