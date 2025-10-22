"use client";

import { useEffect, useState } from "react";
import { HermesClient } from "@pythnetwork/hermes-client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

// Define feed IDs from Pyth (Devnet)
const TOKEN_FEEDS: Record<string, { symbol: string; feedId: string }> = {
  SOL: {
    symbol: "SOL",
    feedId:
      "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  },
  USDC: {
    symbol: "USDC",
    feedId:
      "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  },
  USDT: {
    symbol: "USDT",
    feedId:
      "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
  },
};

const hermesClient = new HermesClient("https://hermes.pyth.network", {});


export function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;

  // Normalize to % change like your original version
  const base = data[0];
  const normalized = data.map((d, i) => ({
    x: i,
    y: ((d - base) / base) * 100,
  }));

  return (
    <ResponsiveContainer width={120} height={40}>
      <LineChart data={normalized}>
        <defs>
          <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <Line
          type="monotone" // smooth curved line
          dataKey="y"
          stroke="url(#sparklineGradient)"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}


export function PriceFeed() {
  const [assetKey, setAssetKey] = useState<keyof typeof TOKEN_FEEDS>("SOL");
  const [price, setPrice] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [change, setChange] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let lastPrice = 0;

    const fetchPrice = async () => {
      try {
        const { feedId } = TOKEN_FEEDS[assetKey];
        const response = await hermesClient.getLatestPriceUpdates([feedId]);
        const parsed = response?.parsed?.[0];
        if (parsed?.price) {
          const raw = Number(parsed.price.price);
          const expo = parsed.price.expo;
          const normalized = raw * Math.pow(10, expo);
          setPrice(normalized);
          setHistory((h) => [...h.slice(-19), normalized]);
          if (lastPrice !== 0) {
            setChange(((normalized - lastPrice) / lastPrice) * 100);
          }
          lastPrice = normalized;
        }
      } catch (err) {
        console.error("Failed to fetch price:", err);
      }
    };

    fetchPrice(); // Fetch immediately
    interval = setInterval(fetchPrice, 5000); // Refresh every 5s

    return () => clearInterval(interval);
  }, [assetKey]);

  return (
    <div className="glassmorphism p-1">
      <Card className="bg-transparent border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Price Feed</CardTitle>
          <Select
            onValueChange={(v) => setAssetKey(v as keyof typeof TOKEN_FEEDS)}
            defaultValue={assetKey}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Asset" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(TOKEN_FEEDS).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold font-heading">
            <motion.div
              key={price}
              initial={{ opacity: 0.5, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {price
                ? `$${price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "—"}
            </motion.div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p
              className={cn(
                "text-xs",
                change >= 0 ? "text-primary" : "text-red-500"
              )}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}% (live)
            </p>
            <Sparkline
              data={history}
              color={change >= 0 ? "hsl(var(--primary))" : "#ef4444"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
