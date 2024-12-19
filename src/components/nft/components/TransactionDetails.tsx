import TransactionStatus from "./TransactionStatus";
import FailureMessage from "./FailureMessage";

interface TransactionDetailsProps {
  transactionHash: string;
  status: string;
  confirmations: number;
  failureReason?: string;
}

const TransactionDetails = ({ 
  transactionHash, 
  status, 
  confirmations, 
  failureReason 
}: TransactionDetailsProps) => {
  return (
    <div className="mt-4 p-4 bg-blue-900/20 rounded-lg space-y-2">
      <TransactionStatus
        transactionHash={transactionHash}
        status={status}
        confirmations={confirmations}
      />
      {status === "Failed" && failureReason && (
        <FailureMessage failureReason={failureReason} />
      )}
    </div>
  );
};

export default TransactionDetails;