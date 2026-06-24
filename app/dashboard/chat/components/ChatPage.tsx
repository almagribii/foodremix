"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "./chatbot";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "ai",
  text: "Halo! Saya Remix Chat. Ada bahan sisa di kulkas yang bingung mau dimasak apa? Atau mau konsultasi resep murah yang aman untuk kondisi fisikmu hari ini?",
};

export default function RemixChatPage() {
  const { token } = useAuth();

  const [currentUserId, setCurrentUserId] = useState<string>("guest");
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUserIdentity = async () => {
      const activeToken = token || localStorage.getItem("token");
      if (!activeToken) return;

      try {
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.user?.id) {
            setCurrentUserId(data.user.id);

            const storageKey = `foodremix_chat_${data.user.id}`;
            const savedChat = localStorage.getItem(storageKey);
            if (savedChat) {
              try {
                setMessages(JSON.parse(savedChat));
              } catch {
                setMessages([WELCOME_MSG]);
              }
            }
          }
        }
      } catch (err) {
        console.error("Gagal sinkronisasi sesi chat lokal:", err);
      }
    };

    fetchUserIdentity();
    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (currentUserId && messages.length > 0) {
      const storageKey = `foodremix_chat_${currentUserId}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, currentUserId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleClearChat = () => {
    setIsClearing(true);
    setTimeout(() => {
      setMessages([WELCOME_MSG]);
      const storageKey = `foodremix_chat_${currentUserId}`;
      localStorage.removeItem(storageKey);
      setIsClearing(false);
    }, 400);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();
    setInput("");

    const userMsgObj: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: userMessageText,
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setLoading(true);

    try {
      const activeToken = token || localStorage.getItem("token");

      const historyContext = messages.slice(-4).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          message: userMessageText,
          history: historyContext,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "ai", text: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "ai",
            text: data.error || "Gagal mendapatkan respons.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: "Terjadi gangguan koneksi server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageText = (text: string) => {
    return text.split("\n").map((line, i) => {
      let content: React.ReactNode = line;

      if (line.includes("**")) {
        const parts = line.split("**");
        content = parts.map((part, idx) =>
          idx % 2 === 1 ? (
            <strong key={idx} className="font-black text-[#EAB308]">
              {part}
            </strong>
          ) : (
            part
          ),
        );
      }

      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <ul key={i} className="list-disc pl-5 my-0.5 space-y-0.5">
            <li>{line.substring(2)}</li>
          </ul>
        );
      }

      return (
        <p key={i} className="min-h-4 leading-relaxed">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-md">
      <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 bg-[#1A1A1A] border border-zinc-800 rounded-xl flex items-center justify-center shrink-0">
            <svg
              className="h-4 w-4 text-[#EAB308]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-black text-zinc-800 tracking-tight">
              Remix Chat AI
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase">
                Enkripsi Riwayat Lokal
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          disabled={loading || isClearing || messages.length <= 1}
          title="Bersihkan Obrolan"
          type="button"
          className="p-2 bg-white border border-zinc-200 text-zinc-400 hover:text-rose-500 hover:border-rose-200 rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center disabled:opacity-40 disabled:hover:text-zinc-400 disabled:hover:border-zinc-200"
        >
          <svg
            className={`h-4 w-4 ${isClearing ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/30 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-20">
          <div className="w-40 h-40 lg:w-70 lg:h-70">
            <Chatbot loop={true} />
          </div>
        </div>    
        <div className="relative z-10 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`h-7 w-7 rounded-lg text-[10px] font-black border tracking-tighter shrink-0 flex items-center justify-center shadow-sm ${isUser ? "bg-zinc-100 text-zinc-700 border-zinc-200" : "bg-white text-zinc-700 border-zinc-200"}`}
                    >
                      {isUser ? "ME" : "AI"}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs shadow-sm space-y-1.5 leading-relaxed ${isUser ? "bg-[#eab308] text-black rounded-tr-none border border-zinc-200" : "bg-white border border-zinc-200/60 text-zinc-700 rounded-tl-none"}`}
                    >
                      {isUser ? msg.text : renderMessageText(msg.text)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start gap-3 pl-10"
            >
              <div className="bg-white border border-zinc-200/60 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
          <div window-scroll-resolver="true" ref={chatEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-zinc-100 bg-white flex items-center gap-3 relative z-10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya resep gizi, alternatif makanan alergi, atau tips hemat..."
          className="flex-1 px-4 py-3 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none transition focus:bg-white focus:border-[#EAB308] focus:ring-2 focus:ring-[#EAB308]/10"
          disabled={loading || isClearing}
          required
        />
        <button
          type="submit"
          disabled={loading || isClearing || !input.trim()}
          className="p-3 bg-[#1A1A1A] hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl transition shadow-sm disabled:opacity-40 flex items-center justify-center shrink-0"
        >
          <svg
            className="h-4 w-4 transform rotate-90 text-[#EAB308]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19l9-7-9-7v14z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
