import { Message } from "./types";

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-3 py-2 animate-fade-in ${
            message.isBot
              ? "bg-[#1A1F2C] text-[#F1F1F1]"
              : "bg-[#33C3F0] text-white"
          }`}
        >
          {message.text}
        </div>
      </div>
    ))}
  </div>
);

export default ChatMessages;