"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MinusIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Chatbot from "./Chatbot";

import type { Message, ChatbotWindowProps, ChatHistory } from "./types";
import { sendPublicChatMessage } from "./actions";
import { quickStartSuggestions, initialWelcomeMessage } from "./constants";
import RenderMessage from "./RenderMessage";
import TypingIndicator from "./TypingIndicator";

export default function ChatbotWindow({ onClose }: ChatbotWindowProps) {
  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messageIdCounter, setMessageIdCounter] = useState<number>(2);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      ...initialWelcomeMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = text || inputText;
      if (messageText.trim() === "" || isTyping) return;

      const userMessageId = messageIdCounter;
      const botMessageId = messageIdCounter + 1;
      setMessageIdCounter((prev) => prev + 2);

      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Add user message
      const newMessage: Message = {
        id: userMessageId,
        text: messageText,
        sender: "user",
        timestamp,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
      setIsTyping(true);

      try {
        const result = await sendPublicChatMessage(messageText, chatHistory);

        const botResponse = result.success
          ? result.response || "Maaf, tidak ada respons."
          : result.error || "Terjadi kesalahan.";

        setChatHistory((prev) => [
          ...prev,
          { role: "user", text: messageText },
          { role: "model", text: botResponse },
        ]);

        setMessages((prev) => [
          ...prev,
          {
            id: botMessageId,
            text: botResponse,
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: botMessageId,
            text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputText, messageIdCounter, isTyping, chatHistory],
  );

  const handleSuggestionClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div
      id="chatbot-window"
      className="
         h-130 w-full
         rounded-2xl
         border border-stone-200/60
         bg-white/95
         shadow-[0_20px_55px_-30px_rgba(26,26,26,0.45)]
         backdrop-blur-md
         flex flex-col 
         overflow-hidden
       "
      
    >
      <div className="flex items-center justify-between border-b border-white/20 bg-linear-to-r from-amber-400 to-yellow-500 p-3 text-white shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-white/20 p-1.5 ring-1 ring-white/30">
            <div className="w-6 h-6">
              <Chatbot />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Foodremix Support</h3>
            <p className="text-xs text-white/85">• Online</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer rounded-full p-1.5 text-white transition-all hover:bg-white/20"
          aria-label="Tutup Chat"
        >
          <MinusIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50/70 p-3 text-stone-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                 max-w-[85%] p-3 rounded-2xl shadow-sm
                 ${
                   msg.sender === "user"
                     ? "rounded-br-sm bg-accent text-black"
                     : "rounded-bl-sm border border-stone-200 bg-white text-stone-700"
                 }
               `}
            >
              <RenderMessage
                content={msg.text}
                isUser={msg.sender === "user"}
              />
              <span
                className={`mt-1 block text-xs ${
                  msg.sender === "user" ? "text-black/75" : "text-stone-400"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-stone-200 bg-white px-3 py-2 text-stone-700 shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && !isTyping && (
        <div className="px-3 pb-2">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {quickStartSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.prompt)}
                className="
                   text-xs px-2.5 py-1.5
                   bg-white hover:bg-amber-50 hover:text-amber-700
                   text-stone-600
                   rounded-full 
                   transition-all duration-200
                   border border-stone-200 hover:border-amber-200
                 "
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-stone-200/60 bg-white p-3">
        <input
          type="text"
          placeholder="Tanya disini..."
          className="
             flex-1
             border border-stone-200 
             p-2.5 px-4
             rounded-full
             bg-stone-50
             text-stone-700
             text-sm
             placeholder:text-stone-400
             focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none
             transition-all
           "
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isTyping) {
              handleSend();
            }
          }}
          disabled={isTyping}
        />
        <button
          onClick={() => handleSend()}
          className="
             bg-accent
             text-black
             p-2.5
             rounded-full
             transition-all duration-200
             hover:bg-(--accent)/90 hover:scale-105
             disabled:opacity-50 disabled:hover:scale-100
             cursor-pointer
           "
          disabled={!inputText.trim() || isTyping}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
