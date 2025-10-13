"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useArena } from "@/context/ArenaContext";

function Sparkline({ data, color }: { data: number[], color: string }) {
  if (data.length < 2) return null;
  const width = 120;
  const height = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}


export function PriceFeed() {
  const { state, dispatch } = useArena();
  const { assets, currentAsset: currentAssetKey } = state;
  const currentAsset = assets[currentAssetKey];

  const switchAsset = (asset: string) => {
    dispatch({ type: 'SWITCH_ASSET', payload: asset });
  };

  return (
    <div className="glassmorphism p-1">
      <Card className="bg-transparent border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Price Feed</CardTitle>
          <Select onValueChange={switchAsset} defaultValue={currentAssetKey}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Asset" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(assets).map(key => (
                <SelectItem key={key} value={key}>{key}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold font-heading">
             <motion.div
                key={currentAsset.price}
                initial={{ opacity: 0.5, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                ${currentAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className={cn(
              "text-xs",
              currentAsset.change >= 0 ? "text-primary" : "text-red-500"
            )}>
              {currentAsset.change >= 0 ? "+" : ""}
              {currentAsset.change.toFixed(2)}% (24h)
            </p>
            <Sparkline data={currentAsset.history} color={currentAsset.change >= 0 ? "hsl(var(--primary))" : "#ef4444"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
