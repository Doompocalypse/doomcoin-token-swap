import { Button } from "@/components/ui/button";
import { MinimizeIcon, X } from "lucide-react";

interface ChatHeaderProps {
  onMinimize: () => void;
  onClose: () => void;
}

const ChatHeader = ({ onMinimize, onClose }: ChatHeaderProps) => (
  <div className="flex items-center justify-between p-4 border-b border-[#8E9196]/10 bg-gradient-to-r from-[#33C3F0]/10 to-[#1A1F2C]">
    <span className="font-medium text-[#F1F1F1] flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#33C3F0] animate-pulse"></span>
      Doomy
    </span>
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-[#1A1F2C]/50 text-[#F1F1F1]"
        onClick={onMinimize}
      >
        <MinimizeIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-[#1A1F2C]/50 text-[#F1F1F1]"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default ChatHeader;