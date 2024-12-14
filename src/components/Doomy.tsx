import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import ChatButton from "./chat/ChatButton";
import ChatHeader from "./chat/ChatHeader";
import ChatInput from "./chat/ChatInput";
import ChatMessages from "./chat/ChatMessages";
import { Message } from "./chat/types";

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
      setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);

      let botResponse = "";
      if (userMessage.includes("connect your wallet")) {
        botResponse = "I'll help you connect your wallet! First, make sure you have MetaMask installed. Then click the 'Connect Wallet' button in the top right corner. Would you like me to guide you through the process?";
      } else if (userMessage.includes("making token swaps")) {
        botResponse = "I can help you swap tokens! First, you'll need to have some tokens in your wallet. Would you like me to explain how token swaps work?";
      } else if (userMessage.includes("checking exchange rates")) {
        botResponse = "I can help you check current exchange rates. Which tokens would you like to compare?";
      } else if (userMessage.includes("understanding crypto basics")) {
        botResponse = "I'd be happy to explain the basics of cryptocurrency! What specific aspect would you like to learn more about? For example:\n- What is a blockchain?\n- How do cryptocurrencies work?\n- What are smart contracts?";
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      }, 500);
    };

    window.addEventListener('chatMessage', handleChatMessage as EventListener);
    return () => window.removeEventListener('chatMessage', handleChatMessage as EventListener);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isBot: false }]);

    const userInput = input.toLowerCase();
    let botResponse = "";

    if (userInput.includes("wallet") || userInput.includes("connect")) {
      botResponse = "To connect your wallet, click the 'Connect Wallet' button in the top right corner. I'll guide you through the process!";
    } else if (userInput.includes("swap") || userInput.includes("exchange")) {
      botResponse = "To swap tokens, first make sure your wallet is connected. Then enter the amount you want to swap and click the 'Swap' button. Would you like me to explain more?";
    } else if (userInput.includes("price") || userInput.includes("rate")) {
      botResponse = "The current exchange rate is shown above the swap input field. It's updated every minute to ensure accuracy! Which tokens would you like to compare?";
    } else {
      botResponse = "I'm here to help with wallet setup and transactions. Let me know what specific help you need!";
    }

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