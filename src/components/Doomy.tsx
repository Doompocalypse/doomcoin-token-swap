import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, MinimizeIcon } from "lucide-react";

interface Message {
  text: string;
  isBot: boolean;
}

const Doomy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm Doomy, your crypto assistant. How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: input, isBot: false }]);

    // Simulate bot response
    const userInput = input.toLowerCase();
    let botResponse = "";

    if (userInput.includes("wallet") || userInput.includes("connect")) {
      botResponse = "To connect your wallet, click the 'Connect Wallet' button in the top right corner. I'll guide you through the process!";
    } else if (userInput.includes("swap") || userInput.includes("exchange")) {
      botResponse = "To swap tokens, first make sure your wallet is connected. Then enter the amount of ETH you want to swap and click the 'Swap' button.";
    } else if (userInput.includes("price") || userInput.includes("rate")) {
      botResponse = "The current exchange rate is shown above the swap input field. It's updated every minute to ensure accuracy!";
    } else {
      botResponse = "I'm here to help with wallet setup and transactions. Could you please clarify what you'd like to know about?";
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
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-[#33C3F0] p-0 shadow-lg hover:opacity-90"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed right-4 bg-[#221F26] border-[#8E9196]/20 shadow-lg transition-all duration-300 ${
      isMinimized ? "bottom-4 h-12 w-72" : "bottom-4 w-72 h-96"
    }`}>
      <div className="flex items-center justify-between p-3 border-b border-[#8E9196]/20">
        <span className="font-medium text-[#F1F1F1]">Doomy</span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-[#1A1F2C]"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <MinimizeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-[#1A1F2C]"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
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

          <div className="p-3 border-t border-[#8E9196]/20">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="bg-[#1A1F2C] border-[#8E9196]/20 focus:border-[#8E9196]"
              />
              <Button
                onClick={handleSend}
                className="bg-[#33C3F0] hover:opacity-90"
              >
                Send
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default Doomy;