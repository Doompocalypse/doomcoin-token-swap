import { Button } from "@/components/ui/button";
import { MinimizeIcon, X } from "lucide-react";

interface ChatHeaderProps {
  onMinimize: () => void;
  onClose: () => void;
}

const ChatHeader = ({ onMinimize, onClose }: ChatHeaderProps) => (
  <div className="flex items-center justify-between p-4 border-b border-[#8E9196]/10 bg-gradient-to-r from-cyan-500/10 to-purple-600/10">
    <span className="font-medium text-[#F1F1F1] flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 animate-pulse"></span>
      Doomy
    </span>
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-white/10 text-[#F1F1F1] rounded-full"
        onClick={onMinimize}
      >
        <MinimizeIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-white/10 text-[#F1F1F1] rounded-full"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default ChatHeader;