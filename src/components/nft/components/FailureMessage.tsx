import CopyButton from "./CopyButton";

interface FailureMessageProps {
  failureReason: string;
}

const FailureMessage = ({ failureReason }: FailureMessageProps) => {
  return (
    <div className="flex justify-between items-start gap-2">
      <p className="text-red-400 break-all select-text">
        Failure Reason: {failureReason}
      </p>
      <CopyButton 
        text={failureReason}
        description="Error message copied to clipboard"
        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
      />
    </div>
  );
};

export default FailureMessage;