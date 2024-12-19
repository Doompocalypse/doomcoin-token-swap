import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FailureMessageProps {
  failureReason: string;
}

const FailureMessage = ({ failureReason }: FailureMessageProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(failureReason);
    toast({
      title: "Copied",
      description: "Error message copied to clipboard",
    });
  };

  return (
    <div className="flex justify-between items-start gap-2">
      <p className="text-red-400 break-all select-text">
        Failure Reason: {failureReason}
      </p>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FailureMessage;