import { Message } from "./types";

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const renderMessageWithLinks = (text: string) => {
    // Split text into segments that might contain links
    const segments = text.split(/(\[.*?\]\(.*?\))/g);
    
    return segments.map((segment, index) => {
      // Check if segment matches markdown link format [text](url)
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
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 whitespace-pre-line leading-relaxed animate-fade-in ${
              message.isBot
                ? "bg-[#1A1F2C] text-[#F1F1F1]"
                : "bg-[#33C3F0] text-white"
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