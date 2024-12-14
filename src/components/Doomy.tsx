import { useState } from "react";
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
            "[Connect your wallet](https://metamask.io/download/) " +
            "[Making token swaps](https://ethereum.org/en/defi/) " +
            "[Checking exchange rates](https://coinmarketcap.com/) " +
            "[Understanding crypto basics](https://ethereum.org/en/what-is-ethereum/)\n\n" +
            "How can I assist you today?", 
      isBot: true 
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isBot: false }]);

    const userInput = input.toLowerCase();
    let botResponse = "";

    if (userInput.includes("wallet") || userInput.includes("connect")) {
      botResponse = "To connect your wallet, [click here to learn about MetaMask](https://metamask.io/download/) or click the 'Connect Wallet' button in the top right corner. I'll guide you through the process!";
    } else if (userInput.includes("swap") || userInput.includes("exchange")) {
      botResponse = "To swap tokens, first make sure your wallet is connected. Then enter the amount of ETH you want to swap and click the 'Swap' button. Learn more about [DeFi and token swaps here](https://ethereum.org/en/defi/).";
    } else if (userInput.includes("price") || userInput.includes("rate")) {
      botResponse = "The current exchange rate is shown above the swap input field. It's updated every minute to ensure accuracy! Check [CoinMarketCap](https://coinmarketcap.com/) for more detailed price information.";
    } else {
      botResponse = "I'm here to help with wallet setup and transactions. Check out [Ethereum basics](https://ethereum.org/en/what-is-ethereum/) or let me know what specific help you need!";
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