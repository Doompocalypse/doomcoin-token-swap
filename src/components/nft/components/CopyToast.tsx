import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface CopyToastProps {
  message: string;
  hash?: string;
}

const CopyToast = ({ message, hash }: CopyToastProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(hash || message);
  };

  return (
    <div className="flex items-start justify-between gap-2">
      <p className="break-all select-text">{message}</p>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleCopy}
        className="h-6 w-6 shrink-0"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CopyToast;