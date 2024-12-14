import { Message } from "./types";

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const renderMessageWithLinks = (text: string) => {
    const segments = text.split(/(\[.*?\]\(.*?\))/g);
    
    return segments.map((segment, index) => {
      const linkMatch = segment.match(/\[(.*?)\]\((.*?)\))/);
      
      if (linkMatch) {
        const [_, text, url] = linkMatch;
        return (
          <a
            key={index}
            href={url}
            className="block text-cyan-400 hover:text-purple-400 transition-colors my-1.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            {text}
          </a>
        );
      }
      
      return <span key={index}>{segment}</span>;
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
            className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-line leading-relaxed ${
              message.isBot
                ? "bg-white/5 text-[#F1F1F1] shadow-lg space-y-1.5"
                : "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg"
            }`}
          >
            {message.isBot ? renderMessageWithLinks(message.text) : message.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;