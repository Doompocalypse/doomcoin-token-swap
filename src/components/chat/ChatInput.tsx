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
  <div className="p-4 border-t border-[#8E9196]/10 bg-gradient-to-r from-cyan-500/5 to-purple-600/5">
    <div className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Type your message..."
        className="bg-white/5 border-[#8E9196]/20 focus:border-cyan-500 text-[#F1F1F1] placeholder:text-[#8E9196] rounded-full"
      />
      <Button 
        onClick={onSend} 
        className="bg-white hover:bg-white/90 text-black transition-colors rounded-full px-3"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default ChatInput;