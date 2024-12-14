import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import ChatButton from "./chat/ChatButton";
import ChatHeader from "./chat/ChatHeader";
import ChatInput from "./chat/ChatInput";
import ChatMessages from "./chat/ChatMessages";
import { Message } from "./chat/types";
import { generateResponse } from "@/utils/chatResponses";

const Doomy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "👋 Hello! I'm Doomy, your friendly crypto assistant. I'm here to help you with:\n\n" +
            "[Connect your wallet](https://metamask.io/download/)\n" +
            "[Making token swaps](https://ethereum.org/en/defi/)\n" +
            "[Checking exchange rates](https://coinmarketcap.com/)\n" +
            "[Understanding crypto basics](https://ethereum.org/en/what-is-ethereum/)" +
            "\n\nHow can I assist you today?", 
      isBot: true 
    },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleChatMessage = (event: CustomEvent<{ text: string }>) => {
      const userMessage = event.detail.text;
      console.log("Received chat message:", userMessage);
      
      setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
      
      const botResponse = generateResponse(userMessage);
      
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      }, 500);
    };

    window.addEventListener('chatMessage', handleChatMessage as EventListener);
    return () => window.removeEventListener('chatMessage', handleChatMessage as EventListener);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    
    console.log("Sending message:", input);
    setMessages((prev) => [...prev, { text: input, isBot: false }]);
    
    const botResponse = generateResponse(input);
    
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
    }, 500);

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!isOpen) {
    return <ChatButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <Card 
      className={`fixed right-4 bg-gradient-to-br from-[#1a1f2c] to-[#2d1f3d] backdrop-blur-md border-[#8E9196]/10 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
        isMinimized ? "bottom-4 h-12 w-80" : "bottom-4 w-80 h-[500px]"
      }`}
    >
      <ChatHeader 
        onMinimize={() => setIsMinimized(!isMinimized)} 
        onClose={() => setIsOpen(false)} 
      />

      {!isMinimized && (
        <>
          <ChatMessages messages={messages} />
          <ChatInput
            input={input}
            onChange={setInput}
            onSend={handleSend}
            onKeyPress={handleKeyPress}
          />
        </>
      )}
    </Card>
  );
};

export default Doomy;