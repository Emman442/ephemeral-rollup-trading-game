"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useArena } from "@/context/ArenaContext";

export function ChatPanel() {
  const { state, dispatch } = useArena();
  const { chat } = state;
  const [message, setMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      dispatch({ type: 'SEND_MESSAGE', payload: message.trim() });
      setMessage("");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {chat.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, type: "spring" }}
                className={cn(
                    "flex flex-col",
                    msg.isSystem ? "items-center" : msg.user === 'You' ? "items-end" : "items-start"
                )}
              >
                {msg.isSystem ? (
                   <p className="text-xs text-primary italic p-1 rounded-md">
                     {msg.text}
                   </p>
                ) : (
                  <div className="flex items-end gap-2 max-w-[80%]">
                    <div className={cn(
                        "rounded-lg p-2 text-sm", 
                        msg.user === 'You' ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <p className="font-bold text-xs mb-1 text-secondary">
                        {msg.user}
                      </p>
                      <p>{msg.text}</p>
                      <p className="text-xs opacity-60 text-right mt-1">{msg.time}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
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
