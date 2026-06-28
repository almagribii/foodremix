'use client';

import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import ChatbotWindow from './ChatbotWindow';
import ScrollToTopButton from '../scroll-to-top';
import Chatbot from './Chatbot';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openChat = (): void => {
    setIsOpen(true);
  };

  const closeChat = (): void => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-2 z-50 md:bottom-6 md:right-6">
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-[calc(100vw-1rem)] sm:w-104">
          <ChatbotWindow onClose={closeChat} />
        </div>
      )}

<div className="flex items-end space-x-1 md:space-x-4">
        {!isOpen && (
          <button
            onClick={openChat}
            className={`
              group relative 
              flex items-center justify-between 
              w-56 md:w-72
              p-2.5 md:p-3 
              rounded-2xl 
              border border-amber-300/60
              bg-linear-to-r from-amber-400 to-yellow-500 text-white
              backdrop-blur-md
              shadow-[0_18px_45px_-22px_rgba(234,179,8,0.95)]
              transition-all duration-300 
              hover:-translate-y-0.5
              hover:shadow-[0_24px_52px_-24px_rgba(245,158,11,0.95)]
              cursor-pointer
            `}
            aria-expanded={isOpen}
            aria-controls="chatbot-window"
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="rounded-full bg-white/20 p-1.5 text-white ring-1 ring-white/40 md:p-2">
                <div className="w-5 h-5 md:w-7 md:h-7">
                  <Chatbot />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white md:text-base">Foodremix Support</h3>
                <p className="text-[10px] text-white/85 md:text-xs">Ada yang ingin ditanyakan?</p>
              </div>
            </div>
            <span className="rounded-full bg-white/20 p-1.5 text-white transition-colors duration-300 group-hover:bg-white/30 md:p-2">
              <PlusIcon className="h-5 w-5 transform transition-transform duration-300 group-hover:rotate-90 md:h-6 md:w-6" />
            </span>
          </button>
        )}

        <ScrollToTopButton isHorizontal={true} />
      </div>
    </div>
  );
}
