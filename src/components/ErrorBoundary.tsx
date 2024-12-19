import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  children: ReactNode;
  fallback: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Since we can't use hooks in class components, we'll create a functional component for the error UI
const ErrorUI = ({ error }: { error: Error }) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(error.message);
    toast({
      title: "Copied",
      description: "Error message copied to clipboard",
    });
  };

  return (
    <div className="p-4 bg-red-900/20 rounded-lg">
      <div className="flex justify-between items-start gap-2">
        <div className="text-red-400">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="break-all select-text">{error.message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorUI error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;