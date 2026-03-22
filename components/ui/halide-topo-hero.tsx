"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800")}>
      <h1 className="text-2xl font-bold mb-2 text-white">Component Example</h1>
      <h2 className="text-xl font-semibold text-zinc-300">{count}</h2>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition" onClick={() => setCount((prev) => prev - 1)}>-</button>
        <button className="px-3 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition" onClick={() => setCount((prev) => prev + 1)}>+</button>
      </div>
    </div>
  );
};
