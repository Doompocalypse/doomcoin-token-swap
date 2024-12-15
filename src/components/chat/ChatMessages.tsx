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
        const isConnectWallet = text.includes("Connect your wallet");
        return (
          <div key={index} className={`my-2 ${isConnectWallet ? "mt-4" : ""}`}>
            <button
              className="text-cyan-400 hover:text-purple-400 transition-colors block text-left"
              onClick={(e) => {
                e.preventDefault();
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
      
      return segment.split('\n').map((line, lineIndex) => (
        <div key={`${index}-${lineIndex}`} className={`${lineIndex > 0 ? 'mt-3' : ''}`}>
          {line}
        </div>
      ));
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 h-[calc(100%-8rem)] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.isBot ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2`}
        >
          <div
            className={`max-w-[90%] rounded-2xl px-4 py-3 whitespace-pre-line leading-relaxed ${
              message.isBot
                ? "bg-white/5 backdrop-blur-sm text-[#F1F1F1] shadow-lg space-y-2"
                : "bg-gradient-to-r from-cyan-500/80 to-purple-600/80 backdrop-blur-sm text-white shadow-lg"
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