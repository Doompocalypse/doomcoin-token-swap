import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton = ({ onClick }: ChatButtonProps) => (
  <Button
    onClick={onClick}
    className="fixed bottom-4 right-4 rounded-full w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 p-0 shadow-lg hover:opacity-90 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
  >
    <MessageCircle className="w-6 h-6 text-white" />
  </Button>
);

export default ChatButton;