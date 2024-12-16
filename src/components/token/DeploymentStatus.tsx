import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface DeploymentStatusProps {
    contractAddress: string;
    errorMessage: string;
    onCopyError: () => void;
}

const DeploymentStatus = ({ contractAddress, errorMessage, onCopyError }: DeploymentStatusProps) => {
    return (
        <>
            {contractAddress && (
                <div className="p-4 bg-green-900/20 rounded-lg">
                    <p className="text-green-400 break-all">
                        Contract deployed successfully at: {contractAddress}
                    </p>
                    <p className="text-sm text-green-300 mt-2">
                        Save this address for future use!
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
                            onClick={onCopyError}
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