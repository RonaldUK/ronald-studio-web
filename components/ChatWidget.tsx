
import React, { useState, useEffect, useRef } from 'react';
import { IconMessage, IconX, IconArrowUp } from '../constants';
import { Message } from '../types';
import { sendMessageToN8N } from '../services/n8nService';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', text: "¡Hola! Bienvenido a Studio Ao-Us. ¿En qué puedo ayudarte hoy?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    const newUserMsg: Message = { id: Date.now(), text: userText, sender: 'user' };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // Call n8n Service
    const botResponse = await sendMessageToN8N(userText);

    const botMsg: Message = { id: Date.now() + 1, text: botResponse, sender: 'bot' };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Ventana de Chat */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in flex flex-col h-[450px]">
          {/* Header Chat */}
          <div className="bg-cobalt p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
              <span className="text-white font-medium text-sm">
                {isTyping ? 'escribiendo...' : 'AO-US Studio Online'}
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <IconX />
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2 text-sm rounded-2xl shadow-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-cobalt text-white rounded-br-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white text-gray-400 border border-gray-100 px-4 py-2 rounded-2xl rounded-bl-none text-xs italic">
                  Se está procesando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu mensaje..." 
              className="flex-1 bg-gray-50 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-cobalt/50 text-gray-700 transition-all"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                !inputValue.trim() || isTyping 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-cobalt text-white hover:bg-blue-700 hover:scale-110 shadow-md'
              }`}
              disabled={!inputValue.trim() || isTyping}
            >
              <IconArrowUp />
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'bg-gray-200 text-gray-600' : 'bg-cobalt text-white'}`}
      >
        {isOpen ? <IconX /> : <IconMessage />}
      </button>
    </div>
  );
};