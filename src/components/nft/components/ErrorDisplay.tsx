import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ErrorDisplayProps {
  errorMessage: string;
}

const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(errorMessage);
    toast({
      title: "Copied",
      description: "Error message copied to clipboard",
    });
  };

  return (
    <div className="mt-4 p-4 bg-red-900/20 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <p className="text-red-400 break-all select-text flex-1">
          {errorMessage}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 flex-shrink-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;