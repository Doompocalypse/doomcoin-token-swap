import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ErrorDisplayProps {
  errorMessage: string;
}

const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorMessage);
      toast({
        title: "Copied",
        description: "Error message copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy error message:", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy error message to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4 p-4 bg-red-900/20 rounded-lg">
      <div className="flex justify-between items-start gap-2">
        <p className="text-red-400 break-all select-text">
          {errorMessage}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="shrink-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;