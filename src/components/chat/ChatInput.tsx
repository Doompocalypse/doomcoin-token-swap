import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  input: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput = ({ input, onChange, onSend, onKeyPress }: ChatInputProps) => (
  <div className="p-3 border-t border-[#8E9196]/20">
    <div className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Type your message..."
        className="bg-[#1A1F2C] border-[#8E9196]/20 focus:border-[#8E9196]"
      />
      <Button onClick={onSend} className="bg-[#33C3F0] hover:opacity-90">
        Send
      </Button>
    </div>
  </div>
);

export default ChatInput;