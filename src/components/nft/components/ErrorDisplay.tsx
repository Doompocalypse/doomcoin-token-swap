import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ErrorDisplayProps {
    errorMessage: string;  // Changed from 'message' to 'errorMessage' to match usage
}

const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
    const { toast } = useToast();

    const copyError = () => {
        navigator.clipboard.writeText(errorMessage);
        toast({
            title: "Copied",
            description: "Error message copied to clipboard",
        });
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
                    onClick={copyError}
                    className="shrink-0"
                >
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default ErrorDisplay;