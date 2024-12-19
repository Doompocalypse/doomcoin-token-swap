import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CopyButtonProps {
  text: string;
  description?: string;
  className?: string;
}

const CopyButton = ({ text, description = "Copied to clipboard", className }: CopyButtonProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={className}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
};

export default CopyButton;