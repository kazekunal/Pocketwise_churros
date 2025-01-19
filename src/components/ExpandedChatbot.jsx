import { useState } from 'react';
import { Send, Sun, Moon } from 'lucide-react';

const ExpandedChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto p-4">
        <div className={`relative bg-gradient-to-r ${
          isDarkMode 
            ? 'from-emerald-900 to-emerald-600' 
            : 'from-emerald-600 to-emerald-400'
        } p-6 rounded-t-xl shadow-lg`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Expanded Financial Assistant</h2>
              <p className={isDarkMode ? 'text-emerald-100' : 'text-emerald-50'}>
                Your personal AI-powered financial advisor
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-6 w-6 text-white" />
              ) : (
                <Moon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        <div className={`h-[70vh] overflow-y-auto p-6 ${
          isDarkMode 
            ? 'bg-gray-800 border-emerald-500/20' 
            : 'bg-white border-emerald-200'
        } border-x`}>
          {messages.length === 0 ? (
            <div className={`flex items-center justify-center h-full ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <p className="text-lg">Start a conversation by asking a question!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-6 ${message.sender === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block max-w-[80%] ${
                    message.sender === "user" 
                      ? 'bg-emerald-600 text-white' 
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-100 border-emerald-500/20'
                        : 'bg-gray-100 text-gray-900 border-emerald-200'
                  } rounded-2xl px-6 py-4 shadow-lg border`}
                >
                  <p className="text-base leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-75 block mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={`${
          isDarkMode 
            ? 'bg-gray-800 border-emerald-500/20' 
            : 'bg-white border-emerald-200'
        } border p-6 rounded-b-xl`}>
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your financial question..."
              className={`flex-1 px-6 py-4 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200'
              } focus:ring-2 focus:outline-none`}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="h-5 w-5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedChatbot;