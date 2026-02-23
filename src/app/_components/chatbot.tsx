"use client";
 
import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import axios from "axios";
 import BACK_END_URL from 'next/config';
const BACK_END_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";
 
type Message = {
  id: string;
  text: string;
  sender: "user" | "assistant";
};
 
export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "How can I help you today?", sender: "assistant" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  const sendMessage = async () => {
    if (!input.trim()) return;
 
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
 
    setMessages((prev) => [...prev, userMsg]);
 
    const currentInput = input;
    setInput("");
    setIsTyping(true);
 
    try {
      const { data } = await axios.post(`${BACK_END_URL}/Chat-Bot`, {
        message: currentInput,
      });
 
      const replyText =
        data.reply || data.response || data.message || "No response";
 
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: replyText,
          sender: "assistant",
        },
      ]);
      console.log(data);
    } catch (error) {
      console.error("API Error:", error);
 
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, something went wrong.",
          sender: "assistant",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };
 
  return (
    <>
      <button
        className="fixed bottom-5 right-5 bg-black p-4 rounded-full shadow-lg hover:bg-gray-800 transition z-50 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
 
      {open && (
        <div className="fixed bottom-24 right-5 w-80 h-[500px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-base font-semibold">Chat assistant</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
 
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.sender === "user"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-gray-900 text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
 
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-900 text-white rounded-2xl px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
 
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border focus-within:border-gray-300">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="bg-black text-white p-2 rounded-full hover:bg-gray-800 disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
 