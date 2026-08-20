import { useEffect, useState } from "react";
import { on } from "../lib/bus";
import type { ToastPayload } from "../lib/bus";
import { IconCheck } from "./icons";

type Toast = ToastPayload & { id: number };

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(
    () =>
      on("ms:toast", (payload) => {
        const id = Date.now() + Math.random();
        setItems((prev) => [...prev.slice(-2), { ...payload, id }]);
        window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4600);
      }),
    [],
  );

  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[70] flex w-[min(92vw,24rem)] -translate-x-1/2 flex-col gap-2.5 sm:left-6 sm:translate-x-0"
      role="status"
      aria-live="polite"
    >
      {items.map((t) => {
        const isErr = t.tone === "error";
        return (
          <div
            key={t.id}
            className={`pop-in pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-[0_22px_45px_-18px_rgba(11,16,32,0.6)] backdrop-blur ${
              isErr ? "bg-red-500 text-white" : "bg-ink/95 text-white ring-1 ring-white/10"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                isErr ? "bg-white/25" : "grad-brand"
              }`}
              aria-hidden="true"
            >
              {isErr ? "!" : <IconCheck className="h-3.5 w-3.5" />}
            </span>
            <p className="text-[13px] font-medium leading-snug">{t.message}</p>
          </div>
        );
      })}
    </div>
  );
}
