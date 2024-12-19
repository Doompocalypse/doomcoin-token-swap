import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "../components/CopyButton";

interface ErrorDisplayProps {
  errorMessage: string;
}

const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
  return (
    <div className="mt-4 p-4 bg-red-900/20 rounded-lg">
      <div className="flex justify-between items-start gap-2">
        <p className="text-red-400 break-all select-text">
          {errorMessage}
        </p>
        <CopyButton 
          text={errorMessage}
          description="Error message copied to clipboard"
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
        />
      </div>
    </div>
  );
};

export default ErrorDisplay;