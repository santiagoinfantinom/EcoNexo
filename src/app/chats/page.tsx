"use client";
import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

type Message = { id: string; from: string; text: string; ts: number };

export default function ChatsPage() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([
    
  ]);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/messages?user=demo-user`, { cache: "no-store" });
        if (res.ok) setMessages(await res.json());
      } catch {}
    })();
  }, []);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = { id: String(Math.random()), from: "demo-user", to: "Ana", text, ts: Date.now() };
    setMessages((prev) => [...prev, msg]);
    setDraft("");
    try { await fetch(`/api/messages`, { method: "POST", body: JSON.stringify({ ...msg, ts: new Date(msg.ts).toISOString() }) }); } catch {}
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">{t("chats")}</h1>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[75%] ${m.from === "Tú" ? "ml-auto bg-green-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100"} px-3 py-2 rounded-lg`}> 
              <div className="text-xs opacity-80 mb-1">{m.from}</div>
              <div>{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="mt-3 flex gap-2">
          <input value={draft} onChange={(e)=>setDraft(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') send(); }} className="flex-1 border rounded px-3 py-2 dark:bg-slate-700 dark:text-slate-100" placeholder={t("typeMessage")} />
          <button onClick={send} className="px-4 py-2 bg-green-600 text-white rounded">{t("send")}</button>
        </div>
      </div>
    </div>
  );
}


