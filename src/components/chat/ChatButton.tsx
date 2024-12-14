import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton = ({ onClick }: ChatButtonProps) => (
  <Button
    onClick={onClick}
    className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-[#33C3F0] p-0 shadow-lg hover:opacity-90 animate-bounce hover:animate-none transition-all duration-300"
  >
    <MessageCircle className="w-6 h-6 animate-pulse" />
  </Button>
);

export default ChatButton;