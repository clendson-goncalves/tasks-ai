"use client";

import { MessageCircle, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { getSetting } from "@/utils/supabase";
import { generateUniqueId } from "@/utils/utils";

interface Message {
  text: string;
  isBot: boolean;
}

export const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => generateUniqueId());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const webhookUrl = await getSetting("chatWebhookUrl");
      if (!webhookUrl) {
        setMessages((prev) => [
          ...prev,
          { text: "Please configure the webhook URL first", isBot: true },
        ]);
        return;
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "chat_message",
          message: userMessage,
          timestamp: new Date().toISOString(),
          userId: userId,
        }),
      });

      if (!response.ok) throw new Error("Webhook request failed");

      const data = await response.json();
      if (
        Array.isArray(data) &&
        data[0] &&
        typeof data[0].output === "string"
      ) {
        setMessages((prev) => [...prev, { text: data[0].output, isBot: true }]);
      }
    } catch (err) {
      console.error("Chat webhook error:", err);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I couldn't process your message", isBot: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 z-700 right-6 p-3 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600 transition-colors"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-gray-800 z-900 rounded-lg shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-white font-medium">Chat</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb:hover]:bg-gray-500">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg.text} isBot={msg.isBot} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-700 text-white rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
