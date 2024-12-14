import { Button } from "@/components/ui/button";
import { MinimizeIcon, X } from "lucide-react";

interface ChatHeaderProps {
  onMinimize: () => void;
  onClose: () => void;
}

const ChatHeader = ({ onMinimize, onClose }: ChatHeaderProps) => (
  <div className="flex items-center justify-between p-3 border-b border-[#8E9196]/20">
    <span className="font-medium text-[#F1F1F1]">Doomy</span>
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-[#1A1F2C]"
        onClick={onMinimize}
      >
        <MinimizeIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-[#1A1F2C]"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default ChatHeader;