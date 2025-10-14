
"use client";

import { useEffect, memo } from "react";
import { Header } from "@/components/arena/Header";
import { PriceFeed } from "@/components/arena/PriceFeed";
import { TradingPanel } from "@/components/arena/TradingPanel";
import { Leaderboard } from "@/components/arena/Leaderboard";
import { ChatPanel } from "@/components/arena/ChatPanel";
import { RoundOverModal } from "@/components/arena/RoundOverModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { MessageSquare, Trophy } from "lucide-react";
import { generateSystemMessage } from "@/ai/flows/generate-system-messages";
import { useArena } from "@/context/ArenaContext";

const RightPanel = memo(function RightPanel() {
  return (
    <Tabs defaultValue="leaderboard" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="leaderboard"><Trophy className="w-4 h-4 mr-2" />Leaderboard</TabsTrigger>
        <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2" />Chat</TabsTrigger>
      </TabsList>
      <TabsContent value="leaderboard" className="flex-grow min-h-0">
        <Leaderboard />
      </TabsContent>
      <TabsContent value="chat" className="flex-grow min-h-0">
        <ChatPanel />
      </TabsContent>
    </Tabs>
  );
});

export function ArenaLayout() {
  const { state, dispatch } = useArena();
  const { isRunning, timeLeft } = state.roundState;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isRunning) {
      const gameLoop = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
      return () => clearInterval(gameLoop);
    }
  }, [isRunning, dispatch]);

  useEffect(() => {
    const systemMessageInterval = setInterval(async () => {
      if (isRunning && Math.random() < 0.1) { // 10% chance every 10 seconds
        try {
          const { message } = await generateSystemMessage({});
          if (message) {
            dispatch({ type: 'ADD_SYSTEM_MESSAGE', payload: message });
          }
        } catch (error) {
          console.error("Error generating system message:", error);
        }
      }
    }, 10000);

    return () => clearInterval(systemMessageInterval);
  }, [isRunning, dispatch]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8 overflow-hidden">
        <div className="relative h-full">
            <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.05))]"></div>
            {isMobile ? (
              <div className="flex flex-col gap-4 h-full">
                <PriceFeed />
                <TradingPanel />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="fixed bottom-4 right-4 z-50">
                      Leaderboard & Chat
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[75vh] p-4 bg-card/95 backdrop-blur-xl">
                    <RightPanel />
                  </SheetContent>
                </Sheet>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                <div className="lg:col-span-3 flex flex-col gap-6">
                  <PriceFeed />
                </div>
                <div className="lg:col-span-6 flex flex-col">
                  <TradingPanel />
                </div>
                <div className="lg:col-span-3 flex flex-col glassmorphism">
                  <RightPanel />
                </div>
              </div>
            )}
        </div>
      </main>
      <RoundOverModal isOpen={!isRunning && timeLeft <= 0} />
    </div>
  );
}
