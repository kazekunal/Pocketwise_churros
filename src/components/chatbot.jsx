import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Expand } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = {
      sender: "user",
      text: trimmedInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const expandChat = () => {
    if (isClient) {
      router.push('/expandedChat');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={toggleChat}
        className="rounded-full bg-emerald-600 p-3 text-white shadow-lg hover:bg-emerald-700 transition-colors"
        aria-label="Toggle chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 rounded-lg bg-gray-900 shadow-xl border border-emerald-500/20">
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-900 to-emerald-600 px-4 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-white">Financial Assistant</h2>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-gray-900">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <p>{message.text}</p>
                  <span className="text-xs opacity-75">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-emerald-500/20 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a financial question..."
                className="flex-1 rounded-lg border border-emerald-500/20 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-4 pt-0">
            <button
              onClick={expandChat}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 border border-emerald-500/20 transition-colors"
            >
              <Expand className="h-5 w-5" />
              Expand Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;