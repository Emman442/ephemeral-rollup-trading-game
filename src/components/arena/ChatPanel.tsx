"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { format } from "date-fns";
import { truncateAddress } from "../../../helpers/trncateAddress";

interface Message {
  player: string;
  message: string;
  isSystemMessage: boolean;
  timestamp?: Date;
}

export function ChatPanel() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { connected, publicKey } = useWallet();
  const socket = useSocket();
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("✅ Connected to server with id:", socket.id);
    };

    const handleGameMessage = (data: Message) => {

       console.log("📩 New game_message received:", data);
      setMessages((prevMessages: any) => [...prevMessages, data]);
    };

    const handleError = (error: any) => {
      console.error("❌ Socket error:", error);
      toast.error(error.message || "An error occurred");
    };
    socket.on("connect", handleConnect);
    socket.on("game_message", handleGameMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("game_message", handleGameMessage);
      socket.off("error", handleError);
    };
  }, [socket]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!socket) return;
    socket.emit("send_message", message);
    setMessage("");
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-grow p-4" viewportRef={scrollViewportRef}>
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg: any) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, type: "spring" }}
                className={cn(
                  "flex flex-col",
                  msg.isSystemMessage
                    ? "items-center"
                    : msg.player === publicKey?.toString()
                    ? "items-end"
                    : "items-start"
                )}
              >
                {msg.isSystemMessage ? (
                  <p className="text-xs text-primary italic p-1 rounded-md">
                    {msg.text}
                  </p>
                ) : (
                  <div className="flex items-end gap-2 max-w-[80%]">
                    <div
                      className={cn(
                        "rounded-lg p-2 text-sm",
                        msg.player === publicKey?.toString()
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="font-bold text-xs mb-1 text-secondary">
                        {msg.player === publicKey?.toString()
                          ? "You"
                          : truncateAddress(msg.player)}
                      </p>
                      <p>{msg.message}</p>
                      <p className="text-xs opacity-60 text-right mt-1">
                        {msg.timestamp
                          ? format(
                              new Date(
                                typeof msg.timestamp === "number"
                                  ? msg.timestamp * 1000
                                  : msg.timestamp
                              ),
                              "HH:mm"
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message..."
            className="bg-input"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
