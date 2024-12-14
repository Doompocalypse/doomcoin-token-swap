import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput = ({ input, onChange, onSend, onKeyPress }: ChatInputProps) => (
  <div className="p-4 border-t border-[#8E9196]/10 bg-gradient-to-r from-[#1A1F2C] to-[#33C3F0]/10">
    <div className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Type your message..."
        className="bg-[#1A1F2C]/50 border-[#8E9196]/20 focus:border-[#33C3F0] text-[#F1F1F1] placeholder:text-[#8E9196]"
      />
      <Button 
        onClick={onSend} 
        className="bg-[#33C3F0] hover:bg-[#33C3F0]/90 transition-colors"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default ChatInput;