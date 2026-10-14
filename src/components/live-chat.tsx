"use client";

import { useEffect, useRef, useState } from "react";
import { useTrovia } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LiveChat({ showId }: { showId: string }) {
  const { chat, sendChat } = useTrovia();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = chat.filter((m) => m.showId === showId).slice(-40);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex h-full min-h-[220px] flex-col rounded-2xl border border-[var(--trovia-ink)]/10 bg-[var(--trovia-panel)]/80 backdrop-blur">
      <div className="border-b border-[var(--trovia-ink)]/8 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--trovia-muted)]">
        Chat
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {messages.length === 0 && (
          <p className="text-sm text-[var(--trovia-muted)]">
            Be first in the room — say hi to the host.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "text-sm leading-snug",
              m.kind === "system" && "text-[var(--trovia-muted)] italic",
              m.kind === "bid" && "text-[var(--trovia-acid-ink)]",
            )}
          >
            {m.kind !== "system" && (
              <span className="font-semibold text-[var(--trovia-ink)]/90">
                {m.user}{" "}
              </span>
            )}
            <span
              className={
                m.kind === "chat" ? "text-[var(--trovia-ink)]/75" : undefined
              }
            >
              {m.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form
        className="flex gap-2 border-t border-[var(--trovia-ink)]/8 p-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendChat(showId, text);
          setText("");
        }}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something…"
          className="border-[var(--trovia-ink)]/10 bg-white/40"
          maxLength={160}
        />
        <Button
          type="submit"
          size="sm"
          className="bg-[var(--trovia-ink)] text-[var(--trovia-paper)] hover:bg-[var(--trovia-ink)]/90"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
