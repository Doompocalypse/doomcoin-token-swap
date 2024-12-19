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
      />
    </div>
  );
};

export default FailureMessage;