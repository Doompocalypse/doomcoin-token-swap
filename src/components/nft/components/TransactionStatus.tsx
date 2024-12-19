import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import CopyButton from "./CopyButton";

interface TransactionStatusProps {
  transactionHash: string;
  status: string;
  confirmations: number;
}

const TransactionStatus = ({ transactionHash, status, confirmations }: TransactionStatusProps) => {
  const getEtherscanUrl = () => `https://sepolia.etherscan.io/tx/${transactionHash}`;

  return (
    <div className="space-y-2">
      <p className="text-blue-400 break-all">
        Transaction Hash: {transactionHash}
      </p>
      <p className="text-blue-300">
        Status: {status}
        {confirmations > 0 && ` (${confirmations} confirmations)`}
      </p>
      <div className="flex gap-2">
        <CopyButton 
          text={transactionHash}
          description="Transaction hash copied to clipboard"
          className="text-blue-400 border-blue-400 hover:bg-blue-400/20"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(getEtherscanUrl(), '_blank')}
          className="text-blue-400 border-blue-400 hover:bg-blue-400/20"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Etherscan
        </Button>
      </div>
    </div>
  );
};

export default TransactionStatus;