"use client";

import { useEffect, useRef, useState } from "react";
import { useTrovia } from "@/lib/store";
import { cn } from "@/lib/utils";

export function LiveChat({
  showId,
  variant = "panel",
}: {
  showId: string;
  variant?: "panel" | "overlay";
}) {
  const { chat, sendChat } = useTrovia();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = chat.filter((m) => m.showId === showId).slice(-28);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const overlay = variant === "overlay";

  return (
    <div
      className={cn(
        "flex flex-col",
        overlay
          ? "max-h-[38vh] w-full max-w-sm"
          : "h-full min-h-[220px] rounded-2xl border border-[var(--trovia-ink)]/10 bg-[var(--trovia-panel)]/80 backdrop-blur",
      )}
    >
      {!overlay && (
        <div className="border-b border-[var(--trovia-ink)]/8 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--trovia-muted)]">
          Chat
        </div>
      )}
      <div
        className={cn(
          "flex-1 space-y-1.5 overflow-y-auto px-1 py-2",
          overlay && "mask-chat-fade pr-2",
        )}
      >
        {messages.length === 0 && (
          <p
            className={cn(
              "text-sm",
              overlay ? "text-white/55" : "text-[var(--trovia-muted)]",
            )}
          >
            Bol do — first in the room gets the vibe.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={m.id}
            className={cn(
              "animate-chat-rise text-[13px] leading-snug",
              overlay
                ? "rounded-lg bg-black/35 px-2 py-1 text-white/90 backdrop-blur-sm"
                : undefined,
              m.kind === "system" &&
                (overlay ? "italic text-white/55" : "italic text-[var(--trovia-muted)]"),
              m.kind === "bid" &&
                (overlay
                  ? "bg-[var(--trovia-acid)]/20 font-medium text-[var(--trovia-acid)]"
                  : "text-[var(--trovia-acid-ink)]"),
            )}
            style={{ animationDelay: `${Math.min(i, 6) * 20}ms` }}
          >
            {m.kind !== "system" && (
              <span
                className={cn(
                  "font-semibold",
                  overlay ? "text-white" : "text-[var(--trovia-ink)]/90",
                )}
              >
                {m.user}{" "}
              </span>
            )}
            <span>{m.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form
        className={cn("flex gap-2", overlay ? "mt-1" : "border-t border-[var(--trovia-ink)]/8 p-2")}
        onSubmit={(e) => {
          e.preventDefault();
          sendChat(showId, text);
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={overlay ? "Chat the host…" : "Say something…"}
          maxLength={160}
          className={cn(
            "h-9 flex-1 rounded-full border px-3 text-sm outline-none",
            overlay
              ? "border-white/15 bg-black/40 text-white placeholder:text-white/45"
              : "border-[var(--trovia-ink)]/10 bg-white/40",
          )}
        />
        <button
          type="submit"
          className={cn(
            "h-9 rounded-full px-3 text-xs font-semibold",
            overlay
              ? "bg-[var(--trovia-acid)] text-[var(--trovia-ink)]"
              : "bg-[var(--trovia-ink)] text-[var(--trovia-paper)]",
          )}
        >
          Send
        </button>
      </form>
    </div>
  );
}
