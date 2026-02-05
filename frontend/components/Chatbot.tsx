"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi 👋 How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", text: input };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMsg.text,
            history: updatedMessages
          })
        }
      );

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "bot", text: data.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "⚠️ Server error. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full 
                   bg-gradient-to-r from-indigo-500 to-purple-600 
                   text-white text-xl shadow-lg hover:scale-105 transition"
      >
        💬
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[480px]
          bg-white rounded-2xl shadow-2xl border
          flex flex-col overflow-hidden
          transition-all duration-300
          ${
            open
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div>
            <p className="font-semibold">AI Assistant</p>
            <p className="text-xs opacity-80">Online</p>
          </div>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Messages */}
        <div className="flex-1 px-3 py-4 overflow-y-auto bg-gray-50 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 text-sm rounded-2xl shadow
                  ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm"
                  }
                `}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white px-3 py-2 rounded-2xl text-sm shadow">
                Typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t flex items-center gap-2 bg-white">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => !loading && e.key === "Enter" && sendMessage()}
            className="text-black flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 
                       text-white rounded-full px-4 py-2 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
