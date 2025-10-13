"use client";

import { ArenaLayout } from "@/components/arena/ArenaLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useArena } from "@/context/ArenaContext";

export default function ArenaPage() {
  const { state } = useArena();
  const { connected } = state;
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  if (!isClient || !connected) {
    return (
      <div className="w-full h-screen p-4 md:p-8">
        <div className="flex items-center space-x-4 mb-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="lg:col-span-6">
                <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-3">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
      </div>
    );
  }

  return <ArenaLayout />;
}
