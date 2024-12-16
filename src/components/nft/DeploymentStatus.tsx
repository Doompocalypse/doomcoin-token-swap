import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DeploymentStatusProps {
    contractAddress: string;
    errorMessage: string;
}

const DeploymentStatus = ({ contractAddress, errorMessage }: DeploymentStatusProps) => {
    const { toast } = useToast();

    const copyError = () => {
        navigator.clipboard.writeText(errorMessage);
        toast({
            title: "Copied",
            description: "Error message copied to clipboard",
        });
    };

    return (
        <>
            {contractAddress && (
                <div className="mt-4 p-4 bg-green-900/20 rounded-lg">
                    <p className="text-green-400 break-all">
                        Contract deployed successfully at: {contractAddress}
                    </p>
                </div>
            )}

            {errorMessage && (
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
            )}
        </>
    );
};

export default DeploymentStatus;