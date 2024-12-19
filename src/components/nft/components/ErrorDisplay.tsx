import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "./CopyButton";

interface ErrorDisplayProps {
  errorMessage: string;
}

const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
  return (
    <div className="mt-4 p-4 bg-red-900/20 rounded-lg overflow-hidden">
      <div className="flex items-start gap-4">
        <p className="text-red-400 break-all select-text flex-1">
          {errorMessage}
        </p>
        <div className="flex-shrink-0">
          <CopyButton 
            text={errorMessage}
            description="Error message copied to clipboard"
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;