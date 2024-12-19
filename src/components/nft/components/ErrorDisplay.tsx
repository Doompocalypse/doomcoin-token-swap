import CopyButton from "./CopyButton";

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
        <CopyButton text={errorMessage} />
      </div>
    </div>
  );
};

export default ErrorDisplay;