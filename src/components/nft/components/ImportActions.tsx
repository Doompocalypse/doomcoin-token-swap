import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";

interface ImportActionsProps {
  onImport: () => void;
  onCopy: () => void;
  contractAddress: string;
  disabled: boolean;
}

const ImportActions = ({ onImport, onCopy, contractAddress, disabled }: ImportActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        onClick={onImport}
        className="text-green-400 border-green-400 hover:bg-green-400/20"
        variant="outline"
        disabled={disabled}
      >
        Import to MetaMask
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onCopy}
        className="text-green-400 border-green-400 hover:bg-green-400/20"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy Contract Address
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`https://sepolia.etherscan.io/address/${contractAddress}`, '_blank')}
        className="text-green-400 border-green-400 hover:bg-green-400/20"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        View on Etherscan
      </Button>
    </div>
  );
};

export default ImportActions;