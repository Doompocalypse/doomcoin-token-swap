import { Button } from "@/components/ui/button";

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton = ({ onClick }: ChatButtonProps) => (
  <Button
    onClick={onClick}
    className="fixed bottom-4 right-4 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 animate-pulse animate-in fade-in slide-in-from-bottom-4"
  >
    <span className="animate-fade-in">Need Help? Click Here</span>
  </Button>
);

export default ChatButton;