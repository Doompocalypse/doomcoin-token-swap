import { Button } from "@/components/ui/button";

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton = ({ onClick }: ChatButtonProps) => (
  <Button
    onClick={onClick}
    className="fixed bottom-4 right-4 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
  >
    <span className="inline-block animate-[pulse_5s_ease-in-out_infinite] transition-all duration-700">
      Need Help? Click Here
    </span>
  </Button>
);

export default ChatButton;