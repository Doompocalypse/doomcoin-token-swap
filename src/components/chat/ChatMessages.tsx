import { Message } from "./types";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessageWithLinks = (text: string) => {
    const segments = text.split(/(\[.*?\]\(.*?\))/g);
    
    return segments.map((segment, index) => {
      const linkMatch = segment.match(/\[(.*?)\]\((.*?)\)/);
      
      if (linkMatch) {
        const [_, text] = linkMatch;
        // Add extra margin-top to the first link ("Connect your wallet")
        const isConnectWallet = text.includes("Connect your wallet");
        return (
          <div key={index} className={`my-2 ${isConnectWallet ? "mt-4" : ""}`}>
            <button
              className="text-cyan-400 hover:text-purple-400 transition-colors block text-left"
              onClick={(e) => {
                e.preventDefault();
                // Simulate a user message with the clicked topic
                const messageEvent = new CustomEvent('chatMessage', {
                  detail: { text: text.toLowerCase() }
                });
                window.dispatchEvent(messageEvent);
              }}
            >
              {text}
            </button>
          </div>
        );
      }
      
      return <span key={index} className="leading-relaxed">{segment}</span>;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-8rem)] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.isBot ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2`}
        >
          <div
            className={`max-w-[90%] rounded-2xl px-4 py-3 whitespace-pre-line leading-relaxed ${
              message.isBot
                ? "bg-white/5 text-[#F1F1F1] shadow-lg space-y-1.5"
                : "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg"
            }`}
          >
            {message.isBot ? renderMessageWithLinks(message.text) : message.text}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;