import { Message } from "./types";

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const renderMessageWithLinks = (text: string) => {
    const segments = text.split(/(\[.*?\]\(.*?\))/g);
    
    return segments.map((segment, index) => {
      const linkMatch = segment.match(/\[(.*?)\]\((.*?)\)/);
      
      if (linkMatch) {
        const [_, text, url] = linkMatch;
        return (
          <a
            key={index}
            href={url}
            className="text-[#33C3F0] hover:underline"
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
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64 scrollbar-thin scrollbar-thumb-[#33C3F0]/20 scrollbar-track-transparent">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.isBot ? "justify-start" : "justify-end"} animate-fade-in`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 whitespace-pre-line leading-relaxed ${
              message.isBot
                ? "bg-[#1A1F2C]/80 text-[#F1F1F1] shadow-lg"
                : "bg-[#33C3F0] text-white shadow-lg"
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